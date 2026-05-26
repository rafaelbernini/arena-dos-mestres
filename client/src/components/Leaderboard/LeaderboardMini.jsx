import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardMini() {
  const { state } = useGame();
  const [top5, setTop5] = useState([]);

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
        }
      } catch {
        if (active) {
          setTop5([]);
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
    <div style={{ background: '#10082a', border: '0.5px solid #1e1040', borderRadius: 10, padding: '10px 12px', minWidth: 140 }}>
      <div style={{ fontSize: 9, color: '#3d2d70', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
        ranking ao vivo
      </div>
      {top5.map((player, index) => (
        <div key={player.id} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
          <span style={{ fontSize: index < 3 ? 14 : 11, minWidth: 20, color: '#5a4a8a' }}>
            {index < 3 ? MEDALS[index] : `${index + 1}º`}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: player.id === state.playerId ? '#f59e0b' : '#c4b5fd', fontWeight: player.id === state.playerId ? 500 : 400 }}>
              {player.nickname}
            </div>
            <div style={{ fontSize: 9, color: '#3d2d70' }}>
              {player.room_emoji} sala {player.current_room_id} · f{player.current_phase}
            </div>
            <div style={{ height: 2, background: '#1a1040', borderRadius: 1, marginTop: 2 }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: 1,
                  background: index === 0 ? '#f59e0b' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : '#4b5563',
                  width: `${Math.min(100, (player.total_score / 10000) * 100)}%`,
                  transition: 'width 0.5s'
                }}
              />
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#c4b5fd', minWidth: 50, textAlign: 'right' }}>
            {player.total_score.toLocaleString('pt-BR')}
          </div>
        </div>
      ))}
    </div>
  );
}
