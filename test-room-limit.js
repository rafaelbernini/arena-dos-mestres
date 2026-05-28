import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:3001';

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
  return response.json();
}

async function testRoomLimit() {
  console.log('🧪 Testando limite de 30 pessoas por sala...\n');

  try {
    const sockets = [];
    let roomFullCount = 0;

    // Criar 32 jogadores
    console.log('📝 Criando 32 jogadores...');
    const players = [];
    for (let i = 0; i < 32; i++) {
      const player = await createPlayer(`Teste ${i + 1}`);
      players.push(player);
    }
    console.log(`✅ 32 jogadores criados\n`);

    // Conectar sockets e emitir player_join
    console.log('🔌 Conectando sockets e emitindo player_join...');
    for (let i = 0; i < 32; i++) {
      const socket = io(SOCKET_URL);

      socket.on('room_full', () => {
        roomFullCount++;
        console.log(`🚫 Jogador ${i + 1} recebeu room_full`);
        socket.disconnect();
      });

      socket.on('welcome', () => {
        console.log(`✅ Jogador ${i + 1} entrou na sala`);
      });

      await new Promise((resolve) => {
        socket.on('connect', () => {
          socket.emit('player_join', {
            playerId: players[i].playerId,
            nickname: `Teste ${i + 1}`,
            roomId: 1
          });
          resolve();
        });
      });

      sockets.push(socket);

      // Pequeno delay para garantir processamento sequencial
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`\n📊 RESULTADO:`);
    console.log(`- Jogadores que receberam room_full: ${roomFullCount}`);
    console.log(`- Jogadores que entraram: ${32 - roomFullCount}`);

    if (roomFullCount === 2) {
      console.log('✅ LIMITE DE 30 PESSOAS FUNCIONANDO CORRETAMENTE!');
    } else {
      console.log(`❌ Esperado 2 rejeitados (da posição 31-32), recebido ${roomFullCount}`);
    }

    // Desconectar todos
    sockets.forEach(s => {
      try {
        s.disconnect();
      } catch (e) {}
    });
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testRoomLimit();
