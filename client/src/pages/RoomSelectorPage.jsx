import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import LeaderboardMini from '../components/Leaderboard/LeaderboardMini.jsx';

const ROOM_COLORS = { 1: '#059669', 2: '#7c3aed', 3: '#0891b2', 4: '#dc2626' };
const ROOM_BGS = { 1: '#042b1a', 2: '#0e082a', 3: '#06182b', 4: '#1a0808' };

export default function RoomSelectorPage() {
  const { state } = useGame();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [unlockMsg, setUnlockMsg] = useState(null);

  const unlockedRooms = useMemo(() => rooms.filter((room) => room.isUnlocked).length, [rooms]);

  useEffect(() => {
    if (!state.playerId) {
      navigate('/');
      return;
    }

    let active = true;
    let previousUnlocked = null;

    async function loadRooms() {
      try {
        const response = await fetch(`/api/rooms/${state.playerId}`);
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (!active) {
          return;
        }

        const unlocked = data.filter((room) => room.isUnlocked).length;
        if (previousUnlocked != null && unlocked > previousUnlocked) {
          const newestRoom = data.find((room) => room.isUnlocked && !rooms.some((oldRoom) => oldRoom.id === room.id && oldRoom.isUnlocked));
          if (newestRoom) {
            setUnlockMsg(`${newestRoom.emoji} ${newestRoom.name} desbloqueada!`);
            setTimeout(() => setUnlockMsg(null), 4000);
          }
        }

        previousUnlocked = unlocked;
        setRooms(data);
      } catch {
        if (active) {
          setRooms([]);
        }
      }
    }

    loadRooms();
    const intervalId = setInterval(loadRooms, 3000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [navigate, state.playerId]);

  const enterRoom = async (room) => {
    if (!room.isUnlocked) {
      return;
    }

    await fetch(`/api/players/${state.playerId}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentRoomId: room.id, currentPhase: Math.max(1, (room.phasesDone?.length || 0) + 1) })
    });

    navigate(`/jogo/${room.id}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#07041a', padding: 16, fontFamily: 'Inter,sans-serif' }}>
      {unlockMsg && (
        <div style={{ background: '#1a1208', border: '0.5px solid #f59e0b', borderRadius: 8, padding: '8px 14px', marginBottom: 12, fontSize: 13, color: '#fcd34d' }}>
          {unlockMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#3d2d70', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>escolha sua arena</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => enterRoom(room)}
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: `0.5px solid ${room.isCompleted ? '#f59e0b' : room.isUnlocked && room.phasesDone.length > 0 ? ROOM_COLORS[room.id] : '#1a1040'}`,
                  background: room.isUnlocked ? '#0f0b28' : '#08051a',
                  cursor: room.isUnlocked ? 'pointer' : 'not-allowed',
                  position: 'relative',
                  opacity: room.isUnlocked ? 1 : 0.5
                }}
              >
                <div style={{ height: 56, background: ROOM_BGS[room.id], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
                  {room.emoji}
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: room.isUnlocked ? '#fff' : '#3d2d70' }}>{room.name}</div>
                  <div style={{ fontSize: 10, color: '#3d2d70', marginBottom: 8 }}>×{room.score_multiplier} pts</div>
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 8 }}>
                    {Array.from({ length: 10 }, (_, index) => index + 1).map((phase) => (
                      <div
                        key={phase}
                        style={{
                          width: 11,
                          height: 11,
                          borderRadius: 3,
                          background: room.phasesDone.includes(phase) ? ROOM_COLORS[room.id] : room.isUnlocked ? '#1a1040' : '#10082a',
                          border: `0.5px solid ${room.isUnlocked ? '#2a1d50' : '#1a1040'}`
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: room.roomScore > 0 ? '#f59e0b' : '#3d2d70' }}>
                      {room.roomScore > 0 ? `${room.roomScore.toLocaleString('pt-BR')} pts` : '— pts'}
                    </span>
                    {room.isCompleted && <span style={{ fontSize: 10, background: '#064e3b', color: '#10b981', border: '0.5px solid #065f46', borderRadius: 20, padding: '2px 8px' }}>✓ completa</span>}
                    {!room.isCompleted && room.isUnlocked && room.phasesDone.length > 0 && <span style={{ fontSize: 10, background: '#2d1b6e', color: '#a78bfa', border: '0.5px solid #4c3494', borderRadius: 20, padding: '2px 8px' }}>fase {room.phasesDone.length}/10</span>}
                    {!room.isUnlocked && <span style={{ fontSize: 10, background: '#10082a', color: '#2a1d50', border: '0.5px solid #1a1040', borderRadius: 20, padding: '2px 8px' }}>bloqueada</span>}
                    {room.isUnlocked && room.phasesDone.length === 0 && !room.isCompleted && <span style={{ fontSize: 10, background: '#1a3a2a', color: '#059669', border: '0.5px solid #064e3b', borderRadius: 20, padding: '2px 8px' }}>disponível</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <LeaderboardMini />
      </div>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#3d2d70' }}>
        <span>pontuação total: <strong style={{ color: '#5a4a8a' }}>{state.totalScore?.toLocaleString('pt-BR')} pts</strong></span>
        <span>salas desbloqueadas: <strong style={{ color: '#5a4a8a' }}>{unlockedRooms}/4</strong></span>
      </div>
    </div>
  );
}
