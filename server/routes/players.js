import { Router } from 'express';
import { v4 as uuid } from 'uuid';

export default function playersRouter(db, activeSessionId) {
  const router = Router();

  router.post('/', (req, res) => {
    const { nickname, heroClass, avatarJson } = req.body;
    if (!nickname || !heroClass) {
      return res.status(400).json({ error: 'nickname e heroClass sao obrigatorios' });
    }

    const normalizedNickname = nickname.trim();
    const existing = db.prepare('SELECT id FROM players WHERE nickname = ?').get(normalizedNickname);
    if (existing) {
      return res.status(409).json({ error: 'Nickname ja em uso' });
    }

    const id = uuid();
    db.prepare(`
      INSERT INTO players (id, nickname, hero_class, avatar_json, current_session_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, normalizedNickname, heroClass, JSON.stringify(avatarJson || {}), activeSessionId);

    db.prepare('INSERT OR IGNORE INTO player_room_progress (player_id, room_id) VALUES (?, 1)').run(id);
    res.json({ playerId: id, nickname: normalizedNickname, sessionId: activeSessionId });
  });

  router.get('/:id', (req, res) => {
    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Jogador nao encontrado' });
    }
    res.json(player);
  });

  router.patch('/:id/connect', (req, res) => {
    const { connected } = req.body;
    db.prepare('UPDATE players SET connected = ? WHERE id = ?').run(connected ? 1 : 0, req.params.id);
    res.json({ ok: true });
  });

  return router;
}
