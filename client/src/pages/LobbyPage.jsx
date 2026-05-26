import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';

export default function LobbyPage() {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { dispatch } = useGame();

  const handleEnter = () => {
    const nick = nickname.trim();
    if (nick.length < 3 || nick.length > 16) { setError('Nick precisa ter 3 a 16 letras!'); return; }
    dispatch({ type: 'LOGIN', payload: { nickname: nick } });
    navigate('/avatar');
  };

  return (
    <div style={{ minHeight:'100vh', background:'#10082a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, padding:20 }}>
      <div style={{ width:80,height:80,borderRadius:'50%',background:'#1e1040',border:'2px solid #7c3aed',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,animation:'float 3s ease-in-out infinite' }}>🏆</div>
      <h1 style={{ fontSize:26, fontWeight:500, color:'#fff', textAlign:'center', margin:0 }}>Arena dos Mestres da Lógica</h1>
      <p style={{ fontSize:14, color:'#5a4a8a', margin:0 }}>Caça ao Tesouro Matemático · SESI · 7° Ano</p>

      <div style={{ background:'#1a1040', border:'0.5px solid #3d2d70', borderRadius:12, padding:'24px 28px', width:'100%', maxWidth:360, display:'flex', flexDirection:'column', gap:14 }}>
        <div>
          <div style={{ fontSize:11, color:'#5a4a8a', letterSpacing:'1px', marginBottom:6 }}>SEU NOME / NICK</div>
          <input
            type="text" maxLength={16} value={nickname}
            onChange={e => { setNickname(e.target.value); setError(''); }}
            onKeyDown={e => e.key==='Enter' && handleEnter()}
            placeholder="Ex: MatematicaKing"
            style={{ width:'100%', background:'#0e0820', border:'0.5px solid #3d2d70', borderRadius:8, padding:'10px 14px', color:'#fff', fontSize:16, outline:'none' }}
          />
          {error && <div style={{ fontSize:12, color:'#ef4444', marginTop:4 }}>{error}</div>}
        </div>
        <button onClick={handleEnter} style={{ background:'#7c3aed', border:'none', borderRadius:10, color:'#fff', fontSize:16, fontWeight:500, padding:'13px', cursor:'pointer' }}>
          ▶ Entrar na Arena
        </button>
      </div>

      <div style={{ fontSize:12, color:'#3d2d70' }}>🌐 Multiplayer em rede local · 40 fases · 4 salas</div>
    </div>
  );
}
