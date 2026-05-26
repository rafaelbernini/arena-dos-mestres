import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createDb } from './db/init.js';
import playersRouter from './routes/players.js';
import roomsRouter from './routes/rooms.js';
import scoresRouter from './routes/scores.js';
import { initSocket } from './sockets/leaderboard.js';

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH'] }
});

app.use(cors());
app.use(express.json());

const db = createDb();

app.use('/api/players', playersRouter(db));
app.use('/api/rooms',   roomsRouter(db, io));
app.use('/api/scores',  scoresRouter(db));

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

initSocket(io, db);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🏆 Arena dos Mestres rodando em http://0.0.0.0:${PORT}`);
  console.log(`   Painel professor: http://0.0.0.0:${PORT}/api/health`);
});
