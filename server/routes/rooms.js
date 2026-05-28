import { Router } from 'express';
import { withTransaction } from '../db/init.js';

export default function roomsRouter(db, io) {
  const router = Router();

  router.get('/leaderboard/global', (_req, res) => {
    res.json(getTop5(db));
  });

  router.get('/:playerId', (req, res) => {
    const { playerId } = req.params;
    const allRooms = db.prepare('SELECT * FROM rooms ORDER BY id').all();
    const progress = db.prepare('SELECT * FROM player_room_progress WHERE player_id = ?').all(playerId);
    const result = allRooms.map((room) => {
      const roomProgress = progress.find((item) => item.room_id === room.id) || null;
      const requiredDone = !room.required_room_id ||
        progress.some((item) => item.room_id === room.required_room_id && item.is_completed === 1);

      return {
        ...room,
        isUnlocked: requiredDone,
        isCompleted: roomProgress?.is_completed === 1,
        roomScore: roomProgress?.room_score || 0,
        phasesDone: roomProgress ? JSON.parse(roomProgress.phases_done) : [],
      };
    });

    res.json(result);
  });

  router.post('/:roomId/phase/:n/complete', (req, res) => {
    const roomId = Number.parseInt(req.params.roomId, 10);
    const phase = Number.parseInt(req.params.n, 10);
    const {
      playerId,
      pointsEarned,
      attemptsUsed,
      hintUsed,
      responseTime,
      variation,
      answerGiven
    } = req.body;

    try {
      const result = withTransaction(db, () => {
        const player = db.prepare('SELECT current_session_id FROM players WHERE id = ?').get(playerId);
        const finalPoints = Math.round(pointsEarned * getRoomMultiplier(db, roomId));

        db.prepare(`
          INSERT INTO response_logs (
            player_id,
            session_id,
            room_id,
            phase,
            variation,
            answer_given,
            is_correct,
            points_earned,
            attempts_used,
            response_time_s,
            hint_used
          )
          VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
        `).run(
          playerId,
          player?.current_session_id || null,
          roomId,
          phase,
          variation || 'A',
          answerGiven || '',
          finalPoints,
          attemptsUsed || 1,
          responseTime || 0,
          hintUsed ? 1 : 0
        );

        const progress = db.prepare(
          'SELECT * FROM player_room_progress WHERE player_id = ? AND room_id = ?'
        ).get(playerId, roomId);
        const phasesDone = progress ? JSON.parse(progress.phases_done) : [];
        if (!phasesDone.includes(phase)) {
          phasesDone.push(phase);
        }

        const isCompleted = phasesDone.length >= 10 ? 1 : 0;

        db.prepare(`
          INSERT INTO player_room_progress (player_id, room_id, phases_done, room_score, is_completed, started_at)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(player_id, room_id) DO UPDATE SET
            phases_done = excluded.phases_done,
            room_score = room_score + ?,
            is_completed = excluded.is_completed,
            completed_at = CASE WHEN excluded.is_completed = 1 THEN CURRENT_TIMESTAMP ELSE completed_at END
        `).run(playerId, roomId, JSON.stringify(phasesDone), finalPoints, isCompleted, finalPoints);

        db.prepare(`
          UPDATE players
          SET total_score = total_score + ?,
              current_room_id = ?,
              current_phase = ?,
              last_updated = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(finalPoints, roomId, phase + 1, playerId);

        let nextRoom = null;
        if (isCompleted) {
          nextRoom = unlockNextRoom(db, playerId, roomId);
        }

        return { finalPoints, phasesDone, isCompleted: isCompleted === 1, nextRoom };
      });

      if (io) {
        const top5 = getTop5(db);
        io.to(`room_${roomId}`).emit('leaderboard_update', top5);
      }

      res.json({
        ok: true,
        pointsEarned: result.finalPoints,
        phasesDone: result.phasesDone,
        isRoomComplete: result.isCompleted,
        nextRoom: result.nextRoom
      });
    } catch (error) {
      console.error('Error completing phase:', error);
      res.status(500).json({
        ok: false,
        error: 'Failed to complete phase'
      });
    }
  });

  return router;
}

function getRoomMultiplier(db, roomId) {
  const room = db.prepare('SELECT score_multiplier FROM rooms WHERE id = ?').get(roomId);
  return room?.score_multiplier || 1.0;
}

function getTop5(db) {
  return db.prepare(`
    SELECT p.id, p.nickname, p.hero_class, p.total_score, p.current_room_id, p.current_phase, p.rooms_completed,
           r.name as room_name, r.emoji as room_emoji
    FROM players p
    LEFT JOIN rooms r ON r.id = p.current_room_id
    WHERE p.connected = 1
    ORDER BY p.total_score DESC, p.rooms_completed DESC, p.last_updated DESC
    LIMIT 5
  `).all();
}

function unlockNextRoom(db, playerId, completedRoomId) {
  db.prepare('UPDATE players SET rooms_completed = rooms_completed + 1 WHERE id = ?').run(playerId);
  const nextRoom = db.prepare('SELECT * FROM rooms WHERE required_room_id = ?').get(completedRoomId);
  if (!nextRoom) {
    return null;
  }

  db.prepare('INSERT OR IGNORE INTO player_room_progress (player_id, room_id) VALUES (?, ?)').run(playerId, nextRoom.id);
  db.prepare(`
    UPDATE players
    SET total_score = total_score + ?,
        current_room_id = ?,
        current_phase = 1,
        last_updated = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(nextRoom.unlock_bonus, nextRoom.id, playerId);

  return nextRoom;
}
