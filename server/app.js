import cors from 'cors';
import express from 'express';
import { createDb, startGameSession } from './db/init.js';
import playersRouter from './routes/players.js';
import roomsRouter from './routes/rooms.js';
import scoresRouter from './routes/scores.js';

const app = express();
const db = createDb();
const activeSessionId = startGameSession(db);

let io = null;

app.use(cors());
app.use(express.json());

app.use('/api/players', playersRouter(db, activeSessionId));
app.use('/api/rooms', (req, res, next) => roomsRouter(db, io)(req, res, next));
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
export function setIo(socketIo) {
  io = socketIo;
}
export default app;
