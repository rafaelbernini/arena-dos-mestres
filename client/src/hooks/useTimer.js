import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(initialSeconds, onExpire) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const intervalRef = useRef(null);
  const expiredRef = useRef(false);

  const start = useCallback(() => {
    expiredRef.current = false;
    setTimeLeft(initialSeconds);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (!expiredRef.current) { expiredRef.current = true; onExpire?.(); }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialSeconds, onExpire]);

  const addTime = useCallback((secs) => setTimeLeft(p => Math.min(p + secs, initialSeconds + 30)), [initialSeconds]);
  const stop = useCallback(() => clearInterval(intervalRef.current), []);

  useEffect(() => {
    const vis = () => {
      if (document.hidden) {
        stop();
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              if (!expiredRef.current) { expiredRef.current = true; onExpire?.(); }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    };
    document.addEventListener('visibilitychange', vis);
    return () => { document.removeEventListener('visibilitychange', vis); stop(); };
  }, [stop, onExpire]);

  const pct = Math.round((timeLeft / initialSeconds) * 100);
  const isWarning = timeLeft <= 20 && timeLeft > 10;
  const isDanger  = timeLeft <= 10;

  return { timeLeft, percentRemaining: pct, isWarning, isDanger, start, stop, addTime };
}
