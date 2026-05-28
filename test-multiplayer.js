import { io } from 'socket.io-client';

const API_URL = 'http://localhost:3001';
const SOCKET_URL = 'http://localhost:3001';

async function createPlayer(nickname) {
  const response = await fetch(`${API_URL}/api/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nickname,
      heroClass: 'explorador',
      avatarJson: { color: '#7c3aed', accessory: 'cajado', gender: 'male' }
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to create player: ${response.statusText}`);
  }

  return response.json();
}

async function completePhase(playerId, roomId, phase, points) {
  const response = await fetch(`${API_URL}/api/rooms/${roomId}/phase/${phase}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerId,
      pointsEarned: points,
      attemptsUsed: 1,
      hintUsed: false,
      responseTime: 10,
      variation: 'A',
      answerGiven: '42'
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to complete phase: ${response.statusText}`);
  }

  return response.json();
}

async function runTest() {
  console.log('🧪 Iniciando teste de múltiplos jogadores...\n');

  try {
    // 1. Criar dois jogadores
    console.log('📝 Criando Jogador 1...');
    const player1 = await createPlayer('Jogador Teste 1');
    console.log(`✅ Jogador 1 criado: ${player1.playerId}\n`);

    console.log('📝 Criando Jogador 2...');
    const player2 = await createPlayer('Jogador Teste 2');
    console.log(`✅ Jogador 2 criado: ${player2.playerId}\n`);

    // 2. Conectar os sockets
    console.log('🔌 Conectando sockets...');
    const socket1 = io(SOCKET_URL);
    const socket2 = io(SOCKET_URL);

    await new Promise((resolve) => {
      let connected = 0;
      socket1.on('connect', () => {
        console.log('✅ Socket 1 conectado');
        connected++;
        if (connected === 2) resolve();
      });
      socket2.on('connect', () => {
        console.log('✅ Socket 2 conectado');
        connected++;
        if (connected === 2) resolve();
      });
    });

    console.log('');

    // 3. Ambos jogadores entram na sala 1
    console.log('📍 Emitindo player_join para ambos...');
    socket1.emit('player_join', {
      playerId: player1.playerId,
      nickname: 'Jogador Teste 1',
      roomId: 1
    });
    socket2.emit('player_join', {
      playerId: player2.playerId,
      nickname: 'Jogador Teste 2',
      roomId: 1
    });

    // 4. Aguardar events
    let player1Events = 0;
    let player2Events = 0;

    socket1.on('leaderboard_update', (data) => {
      player1Events++;
      console.log(`📊 Socket 1 recebeu leaderboard update #${player1Events}:`, data.length, 'jogadores');
    });

    socket2.on('leaderboard_update', (data) => {
      player2Events++;
      console.log(`📊 Socket 2 recebeu leaderboard update #${player2Events}:`, data.length, 'jogadores');
    });

    socket1.on('room_full', () => {
      console.log('🚫 Socket 1 recebeu room_full');
    });

    socket2.on('room_full', () => {
      console.log('🚫 Socket 2 recebeu room_full');
    });

    socket1.on('welcome', (msg) => {
      console.log(`💬 Socket 1 welcomeMessage: ${msg.message}`);
    });

    socket2.on('welcome', (msg) => {
      console.log(`💬 Socket 2 welcomeMessage: ${msg.message}`);
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('\n');

    // 5. Jogador 1 completa a fase
    console.log('🎯 Jogador 1 completando fase 1...');
    const result1 = await completePhase(player1.playerId, 1, 1, 100);
    console.log(`✅ Resultado: ${result1.pointsEarned} pontos`);
    console.log('');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 6. Jogador 2 completa a fase
    console.log('🎯 Jogador 2 completando fase 1...');
    const result2 = await completePhase(player2.playerId, 1, 1, 100);
    console.log(`✅ Resultado: ${result2.pointsEarned} pontos`);
    console.log('');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 7. Verificar estatísticas
    console.log(`\n📈 RESUMO DO TESTE:`);
    console.log(`- Socket 1 recebeu ${player1Events} leaderboard updates`);
    console.log(`- Socket 2 recebeu ${player2Events} leaderboard updates`);
    console.log(`- Ambos devem ter recebido pelo menos 3 updates (join1, join2, phase_complete)`);

    // 8. Desconectar
    socket1.disconnect();
    socket2.disconnect();

    console.log('\n✅ Teste concluído!');
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    process.exit(1);
  }
}

runTest();
