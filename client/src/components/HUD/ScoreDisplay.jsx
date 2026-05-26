import { useEffect, useRef, useState } from 'react';

export default function ScoreDisplay({ score }) {
  const [display, setDisplay] = useState(score);
  const prev = useRef(score);

  useEffect(() => {
    if (score === prev.current) return;
    const diff = score - prev.current;
    const steps = 20;
    const step = diff / steps;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplay(d => Math.round(d + step));
      if (i >= steps) { clearInterval(id); setDisplay(score); prev.current = score; }
    }, 30);
    return () => clearInterval(id);
  }, [score]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: '#5a4a8a', letterSpacing: '1px', textTransform: 'uppercase' }}>pontos</div>
      <div style={{ fontSize: 20, fontWeight: 500, color: '#f59e0b' }}>{display.toLocaleString('pt-BR')}</div>
    </div>
  );
}
