export default function TimerBar({ timeLeft, percentRemaining, isWarning, isDanger, maxTime }) {
  const color = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';
  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 13, color, minWidth: 32, fontWeight: 500 }}>{timeLeft}s</span>
      <div style={{ flex: 1, height: 8, background: '#1a1040', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${percentRemaining}%`,
          background: color, borderRadius: 4,
          transition: 'width 1s linear, background 0.3s',
          animation: isDanger ? 'shake 0.4s infinite' : 'none'
        }} />
      </div>
    </div>
  );
}
