import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { HERO_CLASSES } from '../../../shared/difficulty.js';

const COLORS = ['#7c3aed','#059669','#0891b2','#dc2626','#d97706','#db2777'];
const ACCESSORIES = ['cajado','óculos','capa','chapéu','nenhum'];

export default function AvatarPage() {
  const { state, dispatch } = useGame();
  const socket = useSocket();
  const navigate = useNavigate();
  const [heroClass, setHeroClass] = useState('explorador');
  const [color, setColor] = useState('#7c3aed');
  const [accessory, setAccessory] = useState('cajado');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const EMOJI = { explorador:'🧭', inventor:'🔧', artista:'🎨' };

  const handleCreate = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/players', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ nickname: state.nickname, heroClass, avatarJson: { color, accessory } })
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Erro ao criar personagem'); setLoading(false); return; }
      const data = await res.json();
      dispatch({ type:'LOGIN', payload:{ playerId: data.playerId, nickname: data.nickname, heroClass, avatarJson:{color,accessory}, isLoggedIn:true } });
      socket.emit('player_join', { playerId: data.playerId, nickname: data.nickname });
      navigate('/salas');
    } catch(e) { setError('Erro de conexão com o servidor'); setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#10082a', padding:20, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
      <h2 style={{ color:'#fff', fontSize:20, margin:0 }}>Crie seu Personagem</h2>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:16, width:'100%', maxWidth:560 }}>
        <div style={{ background:'#1a1040', border:'0.5px solid #3d2d70', borderRadius:12, padding:16, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
          <div style={{ fontSize:72 }}>{EMOJI[heroClass]}</div>
          <div style={{ fontSize:14, fontWeight:500, color:'#c4b5fd' }}>{state.nickname}</div>
          <div style={{ fontSize:11, color:'#5a4a8a' }}>{HERO_CLASSES.find(h=>h.id===heroClass)?.label}</div>
          <div style={{ width:24, height:24, borderRadius:'50%', background:color, border:'2px solid rgba(255,255,255,0.3)' }} />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <div style={{ fontSize:11, color:'#5a4a8a', letterSpacing:'1px', marginBottom:8 }}>CLASSE DE HERÓI</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
              {HERO_CLASSES.map(h => (
                <button key={h.id} onClick={()=>setHeroClass(h.id)} style={{
                  background: heroClass===h.id?'#2d1b6e':'#1a1040',
                  border: `0.5px solid ${heroClass===h.id?'#7c3aed':'#2a1d50'}`,
                  borderRadius:8, padding:'8px 6px', cursor:'pointer', color:heroClass===h.id?'#a78bfa':'#5a4a8a', textAlign:'center'
                }}>
                  <div style={{ fontSize:18 }}>{h.emoji}</div>
                  <div style={{ fontSize:9 }}>{h.label.split(' ')[0]}</div>
                </button>
              ))}
            </div>
            <div style={{ fontSize:11, color:'#4a6a8a', marginTop:6 }}>
              ✨ {HERO_CLASSES.find(h=>h.id===heroClass)?.perk}
            </div>
          </div>

          <div>
            <div style={{ fontSize:11, color:'#5a4a8a', letterSpacing:'1px', marginBottom:8 }}>COR FAVORITA</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {COLORS.map(c => (
                <button key={c} onClick={()=>setColor(c)} style={{
                  width:28, height:28, borderRadius:'50%', background:c, border:`2px solid ${color===c?'#fff':'transparent'}`, cursor:'pointer'
                }} />
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize:11, color:'#5a4a8a', letterSpacing:'1px', marginBottom:8 }}>ACESSÓRIO</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {ACCESSORIES.map(a => (
                <button key={a} onClick={()=>setAccessory(a)} style={{
                  background: accessory===a?'#2d1b6e':'#1a1040',
                  border:`0.5px solid ${accessory===a?'#7c3aed':'#2a1d50'}`,
                  borderRadius:6, padding:'4px 10px', fontSize:11, color: accessory===a?'#a78bfa':'#5a4a8a', cursor:'pointer'
                }}>{a}</button>
              ))}
            </div>
          </div>

          {error && <div style={{ fontSize:12, color:'#ef4444' }}>{error}</div>}

          <button onClick={handleCreate} disabled={loading} style={{
            background:'#7c3aed', border:'none', borderRadius:10, color:'#fff',
            fontSize:15, fontWeight:500, padding:12, cursor:'pointer', opacity: loading?0.6:1
          }}>
            {loading ? 'Criando...' : '🗺️ Entrar no Mapa!'}
          </button>
        </div>
      </div>
    </div>
  );
}
