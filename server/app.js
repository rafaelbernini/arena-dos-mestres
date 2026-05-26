import cors from 'cors';
import express from 'express';
import { createDb, startGameSession } from './db/init.js';
import playersRouter from './routes/players.js';
import roomsRouter from './routes/rooms.js';
import scoresRouter from './routes/scores.js';

const app = express();
const db = createDb();
const activeSessionId = startGameSession(db);

app.use(cors());
app.use(express.json());

app.use('/api/players', playersRouter(db, activeSessionId));
app.use('/api/rooms', roomsRouter(db));
app.use('/api/scores', scoresRouter(db));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    ts: Date.now(),
    sessionId: activeSessionId,
    storageMode: process.env.VERCEL ? 'tmp-sqlite' : 'local-sqlite'
  });
});

export { activeSessionId, db };
export default app;
