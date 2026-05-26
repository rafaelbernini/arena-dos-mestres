import { useEffect, useState } from 'react';

export default function ProfessorPage() {
  const [report, setReport] = useState(null);
  const [pin, setPin] = useState('');
  const [auth, setAuth] = useState(false);

  const load = () => fetch('/api/scores/report').then(r=>r.json()).then(setReport);

  if (!auth) return (
    <div style={{ minHeight:'100vh', background:'#07041a', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:14 }}>
      <h2 style={{ color:'#fff' }}>Painel do Professor</h2>
      <input type="password" maxLength={4} value={pin} onChange={e=>setPin(e.target.value)} placeholder="PIN (4 dígitos)"
        style={{ background:'#1a1040', border:'0.5px solid #3d2d70', borderRadius:8, padding:'10px 14px', color:'#fff', fontSize:18, textAlign:'center', width:140 }} />
      <button onClick={()=>{ if(pin==='1234'){setAuth(true);load();} else alert('PIN incorreto'); }}
        style={{ background:'#7c3aed', border:'none', borderRadius:8, color:'#fff', fontSize:15, padding:'10px 24px', cursor:'pointer' }}>Entrar</button>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#07041a', padding:20, fontFamily:'Inter,sans-serif' }}>
      <h2 style={{ color:'#fff', marginBottom:16 }}>📊 Painel do Professor</h2>
      <button onClick={load} style={{ background:'#1a1040', border:'0.5px solid #2a1d50', borderRadius:6, color:'#a78bfa', padding:'6px 14px', cursor:'pointer', fontSize:13, marginBottom:16 }}>
        🔄 Atualizar
      </button>
      {report?.stuck?.length > 0 && (
        <div style={{ background:'#1a0000', border:'0.5px solid #ef4444', borderRadius:8, padding:12, marginBottom:16 }}>
          <div style={{ fontSize:12, color:'#ef4444', marginBottom:6 }}>⚠️ ALUNOS TRAVADOS (&gt;5 min sem avançar)</div>
          {report.stuck.map(s=>(
            <div key={s.nickname} style={{ fontSize:12, color:'#fca5a5' }}>
              {s.nickname} — Sala {s.current_room_id}, Fase {s.current_phase} — {Math.round(s.minutes_idle)} min parado
            </div>
          ))}
        </div>
      )}
      {report?.heatmap && (
        <div>
          <div style={{ fontSize:12, color:'#5a4a8a', marginBottom:8 }}>DESEMPENHO POR FASE</div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, color:'#c4b5fd' }}>
              <thead><tr>
                {['Sala','Fase','Tentativas','Acertos','% Acerto','Tempo Médio (s)','Pistas'].map(h=>(
                  <th key={h} style={{ padding:'6px 10px', textAlign:'left', color:'#5a4a8a', borderBottom:'0.5px solid #1e1040' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {report.heatmap.map(r=>{
                  const pct = r.total_attempts ? Math.round(r.correct/r.total_attempts*100) : 0;
                  return (
                    <tr key={`${r.room_id}-${r.phase}`} style={{ borderBottom:'0.5px solid #10082a', background: pct<50?'rgba(239,68,68,0.08)':pct<75?'rgba(245,158,11,0.06)':'transparent' }}>
                      <td style={{ padding:'5px 10px' }}>{r.room_id}</td>
                      <td style={{ padding:'5px 10px' }}>{r.phase}</td>
                      <td style={{ padding:'5px 10px' }}>{r.total_attempts}</td>
                      <td style={{ padding:'5px 10px' }}>{r.correct}</td>
                      <td style={{ padding:'5px 10px', color: pct<50?'#ef4444':pct<75?'#f59e0b':'#10b981', fontWeight:500 }}>{pct}%</td>
                      <td style={{ padding:'5px 10px' }}>{r.avg_time?.toFixed(1)}</td>
                      <td style={{ padding:'5px 10px' }}>{r.hints_used}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
