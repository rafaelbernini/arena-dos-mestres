import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { HERO_CLASSES } from '../../../shared/difficulty.js';
import VoxelAvatar from '../components/AvatarCreator/VoxelAvatar.jsx';

const COLORS = ['#7c3aed', '#059669', '#0891b2', '#dc2626', '#d97706', '#db2777'];
const ACCESSORIES = [
  { id: 'cajado', label: 'Cajado', icon: '✨' },
  { id: 'oculos', label: 'Oculos', icon: '🕶️' },
  { id: 'capa', label: 'Capa', icon: '🧥' },
  { id: 'chapeu', label: 'Chapeu', icon: '🎩' },
  { id: 'coroa', label: 'Coroa', icon: '👑' },
  { id: 'nenhum', label: 'Sem acessorio', icon: '🙂' }
];

const CLASS_EMOJI = {
  explorador: '🧭',
  inventor: '🔧',
  artista: '🎨'
};

export default function AvatarPage() {
  const { state, dispatch } = useGame();
  const socket = useSocket();
  const navigate = useNavigate();
  const [heroClass, setHeroClass] = useState(state.heroClass || 'explorador');
  const [color, setColor] = useState(state.avatarJson?.color || '#7c3aed');
  const [accessory, setAccessory] = useState(state.avatarJson?.accessory || 'cajado');
  const [gender, setGender] = useState(state.avatarJson?.gender || 'male');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!state.nickname) {
      navigate('/');
    }
  }, [navigate, state.nickname]);

  const selectedClass = useMemo(
    () => HERO_CLASSES.find((hero) => hero.id === heroClass),
    [heroClass]
  );

  const selectedAccessory = useMemo(
    () => ACCESSORIES.find((item) => item.id === accessory),
    [accessory]
  );

  const handleCreate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: state.nickname,
          heroClass,
          avatarJson: { color, accessory, gender }
        })
      });

      if (!response.ok) {
        const payload = await response.json();
        setError(payload.error || 'Erro ao criar personagem');
        setLoading(false);
        return;
      }

      const data = await response.json();
      dispatch({
        type: 'LOGIN',
        payload: {
          playerId: data.playerId,
          nickname: data.nickname,
          heroClass,
          avatarJson: { color, accessory, gender },
          isLoggedIn: true
        }
      });
      socket.emit('player_join', { playerId: data.playerId, nickname: data.nickname, roomId: 1 });
      navigate('/salas');
    } catch (_err) {
      setError('Erro de conexao com o servidor');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #2d1b69, #10082a 55%)',
      padding: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: 980, display: 'grid', gap: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#8a7ab8', fontSize: 12, letterSpacing: 1.2 }}>PASSO 2 DE 3</div>
            <h2 style={{ color: '#fff', fontSize: 30, margin: '8px 0 0' }}>Crie seu personagem</h2>
            <div style={{ color: '#c4b5fd', marginTop: 8 }}>
              Escolha uma classe, uma cor e um acessorio antes de entrar no mapa.
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              alignSelf: 'flex-start',
              background: 'transparent',
              border: '1px solid #3d2d70',
              borderRadius: 10,
              color: '#c4b5fd',
              padding: '10px 14px',
              cursor: 'pointer'
            }}
          >
            Voltar
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 360px) 1fr', gap: 18 }}>
          <div style={{
            background: 'rgba(19, 10, 44, 0.92)',
            border: '1px solid #3d2d70',
            borderRadius: 18,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div style={{ color: '#8a7ab8', fontSize: 12, letterSpacing: 1.1 }}>PREVIEW</div>
            <div style={{
              borderRadius: 18,
              padding: 22,
              background: `radial-gradient(circle at top, ${color}55, #120a2d 60%)`,
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10
            }}>
              <VoxelAvatar color={color} accessory={accessory} gender={gender} />

              <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>
                {state.nickname || 'Jogador'}
              </div>
              <div style={{ color: '#c4b5fd', fontSize: 14 }}>{selectedClass?.label}</div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#120a2d',
                borderRadius: 999,
                padding: '8px 12px',
                color: '#f4f1ff'
              }}>
                <span>{selectedAccessory?.icon}</span>
                <span style={{ fontSize: 13 }}>{selectedAccessory?.label}</span>
              </div>
            </div>

            <div style={{
              background: '#120a2d',
              border: '1px solid #2a1d50',
              borderRadius: 14,
              padding: 14
            }}>
              <div style={{ color: '#8a7ab8', fontSize: 12, marginBottom: 6 }}>VANTAGEM DA CLASSE</div>
              <div style={{ color: '#fff', fontWeight: 700, marginBottom: 4 }}>{selectedClass?.perk}</div>
              <div style={{ color: '#b7acd9', fontSize: 13 }}>{selectedClass?.description}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            <section style={{
              background: 'rgba(19, 10, 44, 0.92)',
              border: '1px solid #3d2d70',
              borderRadius: 18,
              padding: 18
            }}>
              <div style={{ fontSize: 12, color: '#8a7ab8', letterSpacing: 1.1, marginBottom: 12 }}>CLASSE</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
                {HERO_CLASSES.map((hero) => {
                  const selected = heroClass === hero.id;
                  return (
                    <button
                      key={hero.id}
                      onClick={() => setHeroClass(hero.id)}
                      style={{
                        background: selected ? '#2d1b6e' : '#1a1040',
                        border: `1px solid ${selected ? '#8b5cf6' : '#2a1d50'}`,
                        borderRadius: 14,
                        padding: 14,
                        cursor: 'pointer',
                        color: '#fff',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{hero.emoji}</div>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>{hero.label}</div>
                      <div style={{ fontSize: 12, color: selected ? '#ddd6fe' : '#9d90c6' }}>{hero.perk}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section style={{
              background: 'rgba(19, 10, 44, 0.92)',
              border: '1px solid #3d2d70',
              borderRadius: 18,
              padding: 18
            }}>
              <div style={{ fontSize: 12, color: '#8a7ab8', letterSpacing: 1.1, marginBottom: 12 }}>MASCOTE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  onClick={() => setGender('male')}
                  style={{
                    background: gender === 'male' ? '#2d1b6e' : '#1a1040',
                    border: `1px solid ${gender === 'male' ? '#8b5cf6' : '#2a1d50'}`,
                    borderRadius: 14,
                    padding: 12,
                    cursor: 'pointer',
                    color: '#fff',
                  }}
                >Gato 🐱</button>
                <button
                  onClick={() => setGender('female')}
                  style={{
                    background: gender === 'female' ? '#2d1b6e' : '#1a1040',
                    border: `1px solid ${gender === 'female' ? '#8b5cf6' : '#2a1d50'}`,
                    borderRadius: 14,
                    padding: 12,
                    cursor: 'pointer',
                    color: '#fff',
                  }}
                >Gata 🎀</button>
              </div>
            </section>

            <section style={{
              background: 'rgba(19, 10, 44, 0.92)',
              border: '1px solid #3d2d70',
              borderRadius: 18,
              padding: 18
            }}>
              <div style={{ fontSize: 12, color: '#8a7ab8', letterSpacing: 1.1, marginBottom: 12 }}>COR</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {COLORS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setColor(option)}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: option,
                      border: option === color ? '3px solid #fff' : '2px solid transparent',
                      boxShadow: option === color ? '0 0 0 4px rgba(255,255,255,0.12)' : 'none',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </section>

            <section style={{
              background: 'rgba(19, 10, 44, 0.92)',
              border: '1px solid #3d2d70',
              borderRadius: 18,
              padding: 18
            }}>
              <div style={{ fontSize: 12, color: '#8a7ab8', letterSpacing: 1.1, marginBottom: 12 }}>ACESSORIO</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                {ACCESSORIES.map((item) => {
                  const selected = accessory === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setAccessory(item.id)}
                      style={{
                        background: selected ? '#2d1b6e' : '#1a1040',
                        border: `1px solid ${selected ? '#8b5cf6' : '#2a1d50'}`,
                        borderRadius: 14,
                        padding: 12,
                        cursor: 'pointer',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{item.icon}</span>
                      <span style={{ fontSize: 14 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {error && <div style={{ fontSize: 13, color: '#fca5a5' }}>{error}</div>}

            <button
              onClick={handleCreate}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                border: 'none',
                borderRadius: 14,
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                padding: 15,
                cursor: 'pointer',
                opacity: loading ? 0.65 : 1
              }}
            >
              {loading ? 'Criando personagem...' : 'Entrar no mapa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
