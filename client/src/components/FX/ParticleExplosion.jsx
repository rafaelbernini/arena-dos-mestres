import { useEffect, useRef } from 'react';

const COLORS_SUCCESS = ['#10b981','#f59e0b','#7c3aed','#60a5fa','#f472b6'];
const COLORS_ERROR   = ['#ef4444','#f97316','#fbbf24'];

export default function ParticleExplosion({ trigger, type = 'success', x = '50%', y = '40%' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!trigger || !ref.current) return;
    const colors = type === 'success' ? COLORS_SUCCESS : COLORS_ERROR;
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      const size = 6 + Math.random() * 8;
      p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        left:${x};top:${y};pointer-events:none;
        animation:pop ${0.8+Math.random()*0.6}s ease-out forwards;
        animation-delay:${Math.random()*0.3}s;
        transform:translate(${(Math.random()-0.5)*120}px,${(Math.random()-0.5)*120}px)`;
      ref.current.appendChild(p);
      setTimeout(() => p.remove(), 1600);
    }
  }, [trigger]);
  return <div ref={ref} style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }} />;
}
