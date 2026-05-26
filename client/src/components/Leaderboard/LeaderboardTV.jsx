import { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext.jsx';

const MEDALS = ['🥇','🥈','🥉'];

export default function LeaderboardTV() {
  const socket = useSocket();
  const [top5, setTop5] = useState([]);
  const [winner, setWinner] = useState(null);
  const [players, setPlayers] = useState(0);

  useEffect(() => {
    socket.emit('request_leaderboard');
    socket.on('leaderboard_update', (data) => { setTop5(data); setPlayers(data.length); });
    socket.on('absolute_winner', (data) => setWinner(data));
    return () => { socket.off('leaderboard_update'); socket.off('absolute_winner'); };
  }, [socket]);

  return (
    <div style={{ minHeight:'100vh', background:'#07041a', padding:'32px 40px', fontFamily:'Inter,sans-serif' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:'50%',background:'#1e1040',border:'1.5px solid #7c3aed',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22 }}>🏆</div>
          <div>
            <div style={{ fontSize:22, fontWeight:500, color:'#fff' }}>Arena dos Mestres da Lógica</div>
            <div style={{ fontSize:12, color:'#3d2d70' }}>SESI · Matemática · 7° Ano · Ao Vivo</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#1a0000', border:'1px solid #ef4444', borderRadius:20, padding:'6px 14px' }}>
          <div style={{ width:8,height:8,borderRadius:'50%',background:'#ef4444',animation:'blink 1s infinite' }} />
          <span style={{ fontSize:13, color:'#ef4444', fontWeight:500 }}>AO VIVO</span>
        </div>
      </div>

      {winner && (
        <div style={{ background:'#1a1208', border:'2px solid #f59e0b', borderRadius:12, padding:'16px 24px', marginBottom:20, textAlign:'center' }}>
          <div style={{ fontSize:28, fontWeight:500, color:'#f59e0b' }}>🏆 {winner.nickname} ENCONTROU O TESOURO FINAL! 🏆</div>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {top5.map((p, i) => (
          <div key={p.id} style={{
            background: i===0?'#1a1208':i===1?'#0f1218':i===2?'#120c08':'#0f0b28',
            border: `0.5px solid ${i===0?'#f59e0b':i===1?'#9ca3af':i===2?'#b45309':'#1e1850'}`,
            borderRadius:12, padding:'16px 22px', display:'flex', alignItems:'center', gap:18
          }}>
            <span style={{ fontSize:28, minWidth:40, textAlign:'center' }}>{i<3?MEDALS[i]:`${i+1}°`}</span>
            <div style={{ width:44,height:44,borderRadius:'50%',background:'#0e0820',border:`1.5px solid ${i===0?'#f59e0b':'#2a1d50'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>
              {p.hero_class==='explorador'?'🧭':p.hero_class==='inventor'?'🔧':'🎨'}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:22, fontWeight:500, color:'#fff' }}>{p.nickname}</div>
              <div style={{ fontSize:13, color:'#5a4a8a' }}>{p.room_emoji} {p.room_name} · fase {p.current_phase}</div>
            </div>
            <div style={{ flex:2 }}>
              <div style={{ height:10, background:'#1a1040', borderRadius:5, overflow:'hidden' }}>
                <div style={{
                  height:'100%', borderRadius:5, transition:'width 0.8s',
                  background: i===0?'#f59e0b':i===1?'#9ca3af':i===2?'#b45309':'#7c3aed',
                  width:`${Math.min(100,((p.current_room_id-1)*10+p.current_phase)/40*100)}%`
                }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                <span style={{ fontSize:12, color:'#3d2d70' }}>progresso</span>
                <span style={{ fontSize:12, color:'#5a4a8a' }}>{((p.current_room_id-1)*10+(p.current_phase-1))} / 40 fases</span>
              </div>
            </div>
            <div style={{ textAlign:'right', minWidth:100 }}>
              <div style={{ fontSize:28, fontWeight:500, color: i===0?'#f59e0b':i===1?'#d1d5db':i===2?'#fdba74':'#c4b5fd' }}>
                {p.total_score.toLocaleString('pt-BR')}
              </div>
              <div style={{ fontSize:12, color:'#3d2d70' }}>pontos</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:20, display:'flex', justifyContent:'space-between', fontSize:12, color:'#2a1d50' }}>
        <span>{players} jogadores ativos</span>
        <span>localhost:5173/leaderboard-tv</span>
      </div>
    </div>
  );
}
