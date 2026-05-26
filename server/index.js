import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { initSocket } from './sockets/leaderboard.js';
import { db } from './app.js';

const PORT = process.env.PORT || 3001;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH'] }
});

initSocket(io, db);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Arena dos Mestres rodando em http://0.0.0.0:${PORT}`);
  console.log(`Painel professor: http://0.0.0.0:${PORT}/api/health`);
});
