import { Router } from 'express';

export default function scoresRouter(db) {
  const router = Router();

  // GET /api/scores/player/:id — histórico do jogador
  router.get('/player/:id', (req, res) => {
    const logs = db.prepare(`
      SELECT rl.*, r.name as room_name FROM response_logs rl
      JOIN rooms r ON r.id = rl.room_id
      WHERE rl.player_id = ? ORDER BY rl.timestamp DESC
    `).all(req.params.id);
    res.json(logs);
  });

  // GET /api/scores/report — relatório para o professor
  router.get('/report', (req, res) => {
    const heatmap = db.prepare(`
      SELECT room_id, phase,
        COUNT(*) as total_attempts,
        SUM(CASE WHEN is_correct=1 THEN 1 ELSE 0 END) as correct,
        AVG(response_time_s) as avg_time,
        AVG(attempts_used) as avg_attempts,
        SUM(hint_used) as hints_used
      FROM response_logs
      GROUP BY room_id, phase
      ORDER BY room_id, phase
    `).all();

    const stuck = db.prepare(`
      SELECT p.nickname, p.current_room_id, p.current_phase, p.last_updated,
             ROUND((julianday('now') - julianday(p.last_updated)) * 1440) as minutes_idle
      FROM players p
      WHERE p.connected = 1
        AND (julianday('now') - julianday(p.last_updated)) * 1440 > 5
      ORDER BY minutes_idle DESC
    `).all();

    res.json({ heatmap, stuck });
  });

  return router;
}
