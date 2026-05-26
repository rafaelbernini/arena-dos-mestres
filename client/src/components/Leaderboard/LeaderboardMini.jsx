import { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext.jsx';
import { useGame } from '../../context/GameContext.jsx';

const MEDALS = ['🥇','🥈','🥉'];

export default function LeaderboardMini() {
  const socket = useSocket();
  const { state } = useGame();
  const [top5, setTop5] = useState([]);

  useEffect(() => {
    socket.emit('request_leaderboard');
    socket.on('leaderboard_update', setTop5);
    return () => socket.off('leaderboard_update', setTop5);
  }, [socket]);

  return (
    <div style={{ background:'#10082a', border:'0.5px solid #1e1040', borderRadius:10, padding:'10px 12px', minWidth:140 }}>
      <div style={{ fontSize:9, color:'#3d2d70', letterSpacing:'1px', textTransform:'uppercase', marginBottom:8 }}>
        ranking ao vivo
      </div>
      {top5.map((p, i) => (
        <div key={p.id} style={{ display:'flex', alignItems:'center', gap:5, marginBottom:5 }}>
          <span style={{ fontSize: i < 3 ? 14 : 11, minWidth:20, color:'#5a4a8a' }}>
            {i < 3 ? MEDALS[i] : `${i+1}°`}
          </span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color: p.id===state.playerId ? '#f59e0b' : '#c4b5fd', fontWeight: p.id===state.playerId ? 500 : 400 }}>
              {p.nickname}
            </div>
            <div style={{ fontSize:9, color:'#3d2d70' }}>
              {p.room_emoji} sala {p.current_room_id} · f{p.current_phase}
            </div>
            <div style={{ height:2, background:'#1a1040', borderRadius:1, marginTop:2 }}>
              <div style={{ height:'100%', borderRadius:1, background: i===0?'#f59e0b':i===1?'#9ca3af':i===2?'#b45309':'#4b5563',
                width:`${Math.min(100, (p.total_score/10000)*100)}%`, transition:'width 0.5s' }} />
            </div>
          </div>
          <div style={{ fontSize:11, color:'#c4b5fd', minWidth:50, textAlign:'right' }}>
            {p.total_score.toLocaleString('pt-BR')}
          </div>
        </div>
      ))}
    </div>
  );
}
