import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import { useTimer } from '../hooks/useTimer.js';
import { useScore } from '../hooks/useScore.js';
import { PHASES_CONFIG, ROOMS } from '../../../shared/difficulty.js';
import TimerBar from '../components/HUD/TimerBar.jsx';
import ScoreDisplay from '../components/HUD/ScoreDisplay.jsx';
import LeaderboardMini from '../components/Leaderboard/LeaderboardMini.jsx';
import ParticleExplosion from '../components/FX/ParticleExplosion.jsx';

const ROOM_KEYS = { 1:'floresta', 2:'caverna', 3:'porto', 4:'castelo' };

export default function GamePage() {
  const { roomId } = useParams();
  const rId = parseInt(roomId);
  const roomKey = ROOM_KEYS[rId];
  const roomInfo = ROOMS.find(r=>r.id===rId);
  const phases = PHASES_CONFIG[roomKey] || [];

  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const [phase, setPhase]           = useState(1);
  const [variation, setVariation]   = useState(null);
  const [answer, setAnswer]         = useState('');
  const [attempts, setAttempts]     = useState(0);
  const [showHint, setShowHint]     = useState(false);
  const [feedback, setFeedback]     = useState(null);
  const [locked, setLocked]         = useState(false);
  const [particles, setParticles]   = useState(false);
  const [startTime, setStartTime]   = useState(Date.now());

  const handleExpire = useCallback(() => {
    setFeedback({ type:'error', msg:'Tempo esgotado! Passando para a próxima fase...' });
    setTimeout(() => advancePhase(0), 2500);
  }, [phase]);

  const { timeLeft, percentRemaining, isWarning, isDanger, start, addTime } = useTimer(60, handleExpire);
  const { score, errors, addError, addPoints, useHint, reset } = useScore(roomInfo?.multiplier || 1.0);

  useEffect(() => {
    if (!state.playerId) { navigate('/'); return; }
    loadPhase(1);
  }, []);

  const loadPhase = (n) => {
    const cfg = phases.find(p=>p.phase===n);
    if (!cfg) return;
    const vars = cfg.variations;
    setVariation(vars[Math.floor(Math.random()*vars.length)]);
    setAnswer(''); setAttempts(0); setShowHint(false); setFeedback(null);
    setLocked(false); setParticles(false); setStartTime(Date.now());
    reset(); start();
  };

  const checkAnswer = async () => {
    if (locked || !variation) return;
    const responseTime = (Date.now() - startTime) / 1000;
    const userVal = parseFloat(answer.replace(',','.'));
    const correctVal = parseFloat(String(variation.answer).replace(',','.'));
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - correctVal) < 0.01;

    if (isCorrect) {
      const pts = addPoints(timeLeft, 60);
      addTime(10);
      setParticles(true);
      setFeedback({ type:'success', msg:`✅ Correto! +${pts.toLocaleString('pt-BR')} pontos! +10s no relógio!` });
      setLocked(true);

      await fetch(`/api/rooms/${rId}/phase/${phase}/complete`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          playerId: state.playerId, pointsEarned: pts, timeBonus: timeLeft > 20 ? timeLeft*5 : 0,
          attemptsUsed: attempts+1, hintUsed: showHint, responseTime,
          variation: 'A', answerGiven: String(answer)
        })
      }).then(r=>r.json()).then(data => {
        dispatch({ type:'ADD_SCORE', payload: pts });
        if (data.nextRoom) {
          setTimeout(() => {
            alert(`🎉 Você desbloqueou: ${data.nextRoom.emoji} ${data.nextRoom.name}! (+${data.nextRoom.unlock_bonus} pts bônus)`);
          }, 2000);
        }
      });

      setTimeout(() => advancePhase(pts), 2500);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      addError();
      if (newAttempts >= 3) {
        setFeedback({ type:'error', msg:`A resposta era: ${variation.answer}. Não desista! 💪` });
        setLocked(true);
        setTimeout(() => advancePhase(0), 3000);
      } else {
        setFeedback({ type:'error', msg:`Quase! Tente de novo. Tentativas: ${3-newAttempts} restantes. ${showHint?'':' (clique em Pista!)'}`});
        setTimeout(() => { setFeedback(null); setAnswer(''); }, 2000);
      }
    }
  };

  const advancePhase = (pts) => {
    if (phase >= 10) { navigate('/vitoria'); return; }
    const next = phase + 1;
    setPhase(next);
    dispatch({ type:'NEXT_PHASE' });
    loadPhase(next);
  };

  const numpad = (v) => {
    if (locked) return;
    if (v==='del') { setAnswer(a=>a.slice(0,-1)); return; }
    if (v==='-' && answer.length===0) { setAnswer('-'); return; }
    if (v===',' && !answer.includes(',')) { setAnswer(a=>a+','); return; }
    if (answer.length < 8) setAnswer(a=>a+v);
  };

  const cfg = phases.find(p=>p.phase===phase);

  return (
    <div style={{ minHeight:'100vh', background:'#1a0c38', fontFamily:'Inter,sans-serif', position:'relative' }}>
      <ParticleExplosion trigger={particles} type="success" />

      {/* HUD topo */}
      <div style={{ background:'#10082a', padding:'8px 14px', display:'flex', alignItems:'center', gap:12, borderBottom:'0.5px solid #1e1040' }}>
        <button onClick={()=>navigate('/salas')} style={{ background:'none', border:'0.5px solid #2a1d50', borderRadius:6, color:'#5a4a8a', padding:'4px 10px', cursor:'pointer', fontSize:12 }}>← Salas</button>
        <ScoreDisplay score={score} />
        <div style={{ flex:1 }}><TimerBar timeLeft={timeLeft} percentRemaining={percentRemaining} isWarning={isWarning} isDanger={isDanger} /></div>
        <div style={{ fontSize:13, color:'#c4b5fd' }}>{roomInfo?.emoji} fase {phase}/10</div>
        <div style={{ fontSize:11, color:'#f59e0b', background:'#1a1208', borderRadius:4, padding:'2px 8px' }}>×{roomInfo?.multiplier}</div>
      </div>

      <div style={{ padding:14, display:'flex', gap:14 }}>
        <div style={{ flex:1 }}>
          {/* Badge de fase */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <div style={{ background:'#2d1b6e', border:'0.5px solid #4c3494', borderRadius:20, padding:'3px 12px', fontSize:10, color:'#a78bfa' }}>
              fase {phase} · {cfg?.topic}
            </div>
            <div style={{ fontSize:11, color:'#3d2d70' }}>{cfg?.difficulty==='easy'?'⭐':cfg?.difficulty==='medium'?'⭐⭐':'⭐⭐⭐'}</div>
          </div>

          {/* Pergunta */}
          {variation && (
            <div style={{ background:'#10082a', border:'0.5px solid #3d2d70', borderRadius:10, padding:'14px 16px', fontSize:16, color:'#f9d84a', fontWeight:500, marginBottom:10, lineHeight:1.5 }}>
              {variation.q}
            </div>
          )}

          {/* Input */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <div style={{ background:'#0e0820', border:`1.5px solid ${feedback?.type==='success'?'#10b981':feedback?.type==='error'?'#ef4444':'#7c3aed'}`, borderRadius:8, padding:'10px 14px', fontSize:22, color:'#fff', minWidth:100, textAlign:'center', flex:1 }}>
              {answer || '?'}
            </div>
            <button onClick={checkAnswer} disabled={locked||!answer} style={{ background:'#7c3aed', border:'none', borderRadius:8, color:'#fff', fontSize:14, fontWeight:500, padding:'12px 18px', cursor:'pointer', opacity: locked||!answer?0.4:1 }}>
              Confirmar
            </button>
          </div>

          {/* Numpad */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:5, maxWidth:280, marginBottom:8 }}>
            {['1','2','3','4','5','6','7','8','9','0','-'].map(v=>(
              <button key={v} onClick={()=>numpad(v)} disabled={locked} style={{ background:'#1a1040', border:'0.5px solid #2a1d50', borderRadius:6, height:38, fontSize:15, color:'#c4b5fd', cursor:'pointer' }}>{v}</button>
            ))}
            <button onClick={()=>numpad(',')} disabled={locked} style={{ background:'#1a1040', border:'0.5px solid #2a1d50', borderRadius:6, height:38, fontSize:15, color:'#c4b5fd', cursor:'pointer' }}>,</button>
            <button onClick={()=>numpad('del')} disabled={locked} style={{ background:'#1a1040', border:'0.5px solid #2a1d50', borderRadius:6, height:38, fontSize:14, color:'#ef4444', cursor:'pointer' }}>⌫</button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div style={{ fontSize:14, fontWeight:500, color: feedback.type==='success'?'#10b981':'#ef4444', padding:'8px 0', minHeight:30 }}>
              {feedback.msg}
            </div>
          )}

          {/* Pista */}
          <div style={{ marginTop:4 }}>
            {!showHint ? (
              <button onClick={()=>{setShowHint(true);useHint();}} style={{ background:'none', border:'0.5px solid #2a1d50', borderRadius:16, color:'#5a4a8a', padding:'4px 12px', fontSize:12, cursor:'pointer' }}>
                💡 Preciso de uma pista!
              </button>
            ) : (
              <div style={{ fontSize:12, color:'#f9d84a', background:'#1a1208', borderRadius:8, padding:'8px 12px' }}>
                💡 {variation?.hint}
              </div>
            )}
          </div>
        </div>

        <LeaderboardMini />
      </div>
    </div>
  );
}
