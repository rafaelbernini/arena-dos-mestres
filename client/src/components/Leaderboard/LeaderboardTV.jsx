import { useEffect, useState } from 'react';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardTV() {
  const [top5, setTop5] = useState([]);
  const [players, setPlayers] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadLeaderboard() {
      try {
        const response = await fetch('/api/rooms/leaderboard/global');
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (active) {
          setTop5(data);
          setPlayers(data.length);
        }
      } catch {
        if (active) {
          setTop5([]);
          setPlayers(0);
        }
      }
    }

    loadLeaderboard();
    const intervalId = setInterval(loadLeaderboard, 2500);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#07041a', padding: '32px 40px', fontFamily: 'Inter,sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1e1040', border: '1.5px solid #7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏆</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#fff' }}>Arena dos Mestres da Lógica</div>
            <div style={{ fontSize: 12, color: '#3d2d70' }}>SESI · Matemática · 7° Ano · Ao Vivo</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1a0000', border: '1px solid #ef4444', borderRadius: 20, padding: '6px 14px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'blink 1s infinite' }} />
          <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 500 }}>ATUALIZANDO</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {top5.map((player, index) => (
          <div
            key={player.id}
            style={{
              background: index === 0 ? '#1a1208' : index === 1 ? '#0f1218' : index === 2 ? '#120c08' : '#0f0b28',
              border: `0.5px solid ${index === 0 ? '#f59e0b' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : '#1e1850'}`,
              borderRadius: 12,
              padding: '16px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 18
            }}
          >
            <span style={{ fontSize: 28, minWidth: 40, textAlign: 'center' }}>{index < 3 ? MEDALS[index] : `${index + 1}º`}</span>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0e0820', border: `1.5px solid ${index === 0 ? '#f59e0b' : '#2a1d50'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {player.hero_class === 'explorador' ? '🧭' : player.hero_class === 'inventor' ? '🔧' : '🎨'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 500, color: '#fff' }}>{player.nickname}</div>
              <div style={{ fontSize: 13, color: '#5a4a8a' }}>{player.room_emoji} {player.room_name} · fase {player.current_phase}</div>
            </div>
            <div style={{ flex: 2 }}>
              <div style={{ height: 10, background: '#1a1040', borderRadius: 5, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: 5,
                    transition: 'width 0.8s',
                    background: index === 0 ? '#f59e0b' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : '#7c3aed',
                    width: `${Math.min(100, ((player.current_room_id - 1) * 10 + player.current_phase) / 40 * 100)}%`
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 12, color: '#3d2d70' }}>progresso</span>
                <span style={{ fontSize: 12, color: '#5a4a8a' }}>{((player.current_room_id - 1) * 10 + (player.current_phase - 1))} / 40 fases</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 100 }}>
              <div style={{ fontSize: 28, fontWeight: 500, color: index === 0 ? '#f59e0b' : index === 1 ? '#d1d5db' : index === 2 ? '#fdba74' : '#c4b5fd' }}>
                {player.total_score.toLocaleString('pt-BR')}
              </div>
              <div style={{ fontSize: 12, color: '#3d2d70' }}>pontos</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#2a1d50' }}>
        <span>{players} jogadores ativos</span>
        <span>/leaderboard-tv</span>
      </div>
    </div>
  );
}
