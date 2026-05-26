const playerSockets = new Map();

export function initSocket(io, db) {
  io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id);

    socket.on('player_join', ({ playerId, nickname }) => {
      playerSockets.set(playerId, socket.id);
      db.prepare('UPDATE players SET connected = 1 WHERE id = ?').run(playerId);
      const top5 = getTop5(db);
      io.emit('leaderboard_update', top5);
      socket.broadcast.emit('player_activity', { type: 'join', nickname });
      socket.emit('welcome', { message: `Bem-vindo, ${nickname}!` });
    });

    socket.on('request_leaderboard', () => {
      socket.emit('leaderboard_update', getTop5(db));
    });

    socket.on('phase_start', ({ playerId, roomId, phase }) => {
      db.prepare('UPDATE players SET last_updated = CURRENT_TIMESTAMP WHERE id = ?').run(playerId);
    });

    socket.on('disconnect', () => {
      for (const [pid, sid] of playerSockets.entries()) {
        if (sid === socket.id) {
          playerSockets.delete(pid);
          db.prepare('UPDATE players SET connected = 0 WHERE id = ?').run(pid);
          const top5 = getTop5(db);
          io.emit('leaderboard_update', top5);
          break;
        }
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
