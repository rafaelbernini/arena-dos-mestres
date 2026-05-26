import { Router } from 'express';

export default function scoresRouter(db) {
  const router = Router();

  router.get('/player/:id', (req, res) => {
    const logs = db.prepare(`
      SELECT rl.*, r.name as room_name
      FROM response_logs rl
      JOIN rooms r ON r.id = rl.room_id
      WHERE rl.player_id = ?
      ORDER BY rl.timestamp DESC
    `).all(req.params.id);

    res.json(logs);
  });

  router.get('/report', (_req, res) => {
    const heatmap = db.prepare(`
      SELECT room_id, phase,
        COUNT(*) as total_attempts,
        SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct,
        AVG(response_time_s) as avg_time,
        AVG(attempts_used) as avg_attempts,
        SUM(hint_used) as hints_used
      FROM response_logs
      GROUP BY room_id, phase
      ORDER BY room_id, phase
    `).all();

    const stuck = db.prepare(`
      SELECT p.nickname, p.current_room_id, r.name as room_name, p.current_phase, p.last_updated,
             ROUND((julianday('now') - julianday(p.last_updated)) * 1440) as minutes_idle,
             SUBSTR(COALESCE(p.current_session_id, ''), 1, 8) as session_code
      FROM players p
      LEFT JOIN rooms r ON r.id = p.current_room_id
      WHERE p.connected = 1
        AND (julianday('now') - julianday(p.last_updated)) * 1440 > 5
      ORDER BY minutes_idle DESC
    `).all();

    const sessions = db.prepare(`
      SELECT
        gs.id,
        SUBSTR(gs.id, 1, 8) as session_code,
        gs.started_at,
        gs.ended_at,
        COUNT(DISTINCT p.id) as players_count,
        COUNT(DISTINCT rl.id) as total_responses,
        ROUND(AVG(rl.response_time_s), 1) as avg_response_time,
        SUM(CASE WHEN rl.is_correct = 1 THEN 1 ELSE 0 END) as correct_answers
      FROM game_sessions gs
      LEFT JOIN players p ON p.current_session_id = gs.id
      LEFT JOIN response_logs rl ON rl.session_id = gs.id
      GROUP BY gs.id, gs.started_at, gs.ended_at
      ORDER BY gs.started_at DESC
    `).all().map((session) => ({
      ...session,
      accuracy: session.total_responses
        ? Math.round((session.correct_answers || 0) / session.total_responses * 100)
        : 0
    }));

    const players = db.prepare(`
      SELECT
        p.id,
        p.nickname,
        p.hero_class,
        p.total_score,
        p.rooms_completed,
        p.connected,
        p.current_phase,
        p.created_at,
        p.last_updated,
        p.current_session_id,
        SUBSTR(COALESCE(p.current_session_id, ''), 1, 8) as session_code,
        r.name as current_room_name,
        r.emoji as current_room_emoji,
        COUNT(rl.id) as total_attempts,
        SUM(CASE WHEN rl.is_correct = 1 THEN 1 ELSE 0 END) as correct_answers,
        ROUND(AVG(rl.response_time_s), 1) as avg_response_time,
        MAX(rl.response_time_s) as max_response_time,
        SUM(CASE WHEN rl.hint_used = 1 THEN 1 ELSE 0 END) as hints_used,
        COUNT(DISTINCT rl.room_id) as rooms_visited,
        GROUP_CONCAT(DISTINCT rooms_hist.name) as rooms_played
      FROM players p
      LEFT JOIN rooms r ON r.id = p.current_room_id
      LEFT JOIN response_logs rl ON rl.player_id = p.id
      LEFT JOIN rooms rooms_hist ON rooms_hist.id = rl.room_id
      GROUP BY p.id, p.nickname, p.hero_class, p.total_score, p.rooms_completed, p.connected,
               p.current_phase, p.created_at, p.last_updated, p.current_session_id, r.name, r.emoji
      ORDER BY p.last_updated DESC, p.total_score DESC
    `).all().map((player) => ({
      ...player,
      accuracy: player.total_attempts
        ? Math.round((player.correct_answers || 0) / player.total_attempts * 100)
        : 0
    }));

    const recentResponses = db.prepare(`
      SELECT
        rl.id,
        rl.timestamp,
        rl.response_time_s,
        rl.attempts_used,
        rl.hint_used,
        rl.points_earned,
        rl.answer_given,
        rl.phase,
        p.nickname,
        p.hero_class,
        SUBSTR(COALESCE(rl.session_id, p.current_session_id, ''), 1, 8) as session_code,
        r.name as room_name,
        r.emoji as room_emoji
      FROM response_logs rl
      JOIN players p ON p.id = rl.player_id
      JOIN rooms r ON r.id = rl.room_id
      ORDER BY rl.timestamp DESC
      LIMIT 25
    `).all();

    res.json({ heatmap, stuck, sessions, players, recentResponses });
  });

  return router;
}
