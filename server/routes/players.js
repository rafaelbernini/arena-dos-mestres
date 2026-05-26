import { Router } from 'express';
import { v4 as uuid } from 'uuid';

export default function playersRouter(db) {
  const router = Router();

  // POST /api/players — criar jogador
  router.post('/', (req, res) => {
    const { nickname, heroClass, avatarJson } = req.body;
    if (!nickname || !heroClass) return res.status(400).json({ error: 'nickname e heroClass são obrigatórios' });
    const existing = db.prepare('SELECT id FROM players WHERE nickname = ?').get(nickname);
    if (existing) return res.status(409).json({ error: 'Nickname já em uso' });
    const id = uuid();
    db.prepare(`
      INSERT INTO players (id, nickname, hero_class, avatar_json)
      VALUES (?, ?, ?, ?)
    `).run(id, nickname.trim(), heroClass, JSON.stringify(avatarJson || {}));
    db.prepare('INSERT OR IGNORE INTO player_room_progress (player_id, room_id) VALUES (?, 1)').run(id);
    res.json({ playerId: id, nickname });
  });

  // GET /api/players/:id — estado do jogador
  router.get('/:id', (req, res) => {
    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(req.params.id);
    if (!player) return res.status(404).json({ error: 'Jogador não encontrado' });
    res.json(player);
  });

  // PATCH /api/players/:id/connect — marcar online/offline
  router.patch('/:id/connect', (req, res) => {
    const { connected } = req.body;
    db.prepare('UPDATE players SET connected = ? WHERE id = ?').run(connected ? 1 : 0, req.params.id);
    res.json({ ok: true });
  });

  return router;
}
