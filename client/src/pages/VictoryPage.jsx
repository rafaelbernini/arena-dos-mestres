import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';

export default function VictoryPage() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:'100vh', background:'#07041a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:20 }}>
      <div style={{ fontSize:72 }}>🏆</div>
      <h1 style={{ color:'#f59e0b', fontSize:26, margin:0 }}>Tesouro Encontrado!</h1>
      <p style={{ color:'#c4b5fd', margin:0 }}>{state.nickname} · {state.heroClass}</p>
      <div style={{ fontSize:36, fontWeight:500, color:'#f59e0b' }}>{state.totalScore?.toLocaleString('pt-BR')} pts</div>
      <div style={{ display:'flex', gap:10, marginTop:10 }}>
        <button onClick={()=>navigate('/salas')} style={{ background:'#7c3aed', border:'none', borderRadius:10, color:'#fff', fontSize:15, padding:'12px 24px', cursor:'pointer' }}>
          Continuar Jogando
        </button>
        <button onClick={()=>navigate('/leaderboard-tv')} style={{ background:'#0f0b28', border:'0.5px solid #2a1d50', borderRadius:10, color:'#a78bfa', fontSize:15, padding:'12px 24px', cursor:'pointer' }}>
          Ver Telão
        </button>
      </div>
    </div>
  );
}
