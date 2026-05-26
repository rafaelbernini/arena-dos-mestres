import { useState, useCallback } from 'react';
import { DIFFICULTY, SCORING } from '../../../shared/difficulty.js';

export function useScore(roomMultiplier = 1.0) {
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  const addError = useCallback(() => {
    setErrors(e => e + 1);
    setScore(s => Math.max(0, s - DIFFICULTY.penaltyPerError));
  }, []);

  const addPoints = useCallback((timeRemaining, maxTime) => {
    const pts = SCORING.calculate(SCORING.BASE_POINTS, timeRemaining, maxTime, errors, roomMultiplier);
    setScore(s => s + pts);
    return pts;
  }, [errors, roomMultiplier]);

  const useHint = useCallback(() => { setHintUsed(true); }, []);
  const reset = useCallback(() => { setErrors(0); setHintUsed(false); }, []);

  return { score, errors, hintUsed, addError, addPoints, useHint, reset };
}
