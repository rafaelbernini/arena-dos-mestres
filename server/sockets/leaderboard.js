const MAX_PLAYERS_PER_ROOM = 30;
const playerRooms = new Map();

export function initSocket(io, db) {
  io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id);

    socket.on('player_join', ({ playerId, nickname, roomId }) => {
      const roomIdNum = Number.parseInt(roomId, 10) || 1;

      const playerCount = db.prepare(
        'SELECT COUNT(*) as count FROM players WHERE current_room_id = ? AND connected = 1'
      ).get(roomIdNum);

      if (playerCount.count >= MAX_PLAYERS_PER_ROOM) {
        socket.emit('room_full', { message: `A sala está cheia (${MAX_PLAYERS_PER_ROOM} jogadores máximo)` });
        socket.disconnect(true);
        return;
      }

      playerRooms.set(socket.id, { playerId, roomId: roomIdNum });
      socket.join(`room_${roomIdNum}`);

      db.prepare('UPDATE players SET connected = 1, current_room_id = ? WHERE id = ?').run(roomIdNum, playerId);
      const top5 = getTop5(db);
      io.to(`room_${roomIdNum}`).emit('leaderboard_update', top5);
      socket.broadcast.to(`room_${roomIdNum}`).emit('player_activity', { type: 'join', nickname });
      socket.emit('welcome', { message: `Bem-vindo, ${nickname}!` });
    });

    socket.on('request_leaderboard', () => {
      socket.emit('leaderboard_update', getTop5(db));
    });

    socket.on('phase_start', ({ playerId, roomId, phase }) => {
      db.prepare('UPDATE players SET last_updated = CURRENT_TIMESTAMP WHERE id = ?').run(playerId);
    });

    socket.on('disconnect', () => {
      const roomInfo = playerRooms.get(socket.id);
      if (roomInfo) {
        playerRooms.delete(socket.id);
        db.prepare('UPDATE players SET connected = 0 WHERE id = ?').run(roomInfo.playerId);
        const top5 = getTop5(db);
        io.to(`room_${roomInfo.roomId}`).emit('leaderboard_update', top5);
      }
    });
  });
}

function getTop5(db) {
  return db.prepare(`
    SELECT p.id, p.nickname, p.hero_class, p.total_score,
           p.current_room_id, p.current_phase, p.rooms_completed,
           r.name as room_name, r.emoji as room_emoji
    FROM players p
    LEFT JOIN rooms r ON r.id = p.current_room_id
    WHERE p.connected = 1
    ORDER BY p.total_score DESC, p.rooms_completed DESC
    LIMIT 5
  `).all();
}
