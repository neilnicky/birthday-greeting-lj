import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './useReducedMotion';

// Character-by-character reveal with punctuation pauses + jitter.
// Returns { displayText, isComplete, cursorVisible }.
export function useTypewriter(text, options = {}) {
  const {
    speed = 25,
    pauseComma = 100,
    pausePeriod = 200,
    jitter = 8,
    enabled = true,
  } = options;

  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setDisplayText('');
      setIsComplete(false);
      return undefined;
    }

    // Reduced motion: show full text at once.
    if (prefersReducedMotion()) {
      setDisplayText(text);
      setIsComplete(true);
      return undefined;
    }

    let i = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      if (i >= text.length) {
        setIsComplete(true);
        return;
      }
      const ch = text[i];
      i += 1;
      setDisplayText(text.slice(0, i));

      let delay = speed + (Math.random() * 2 - 1) * jitter;
      if (ch === ',' || ch === ';') delay += pauseComma;
      else if (ch === '.' || ch === '!' || ch === '?') delay += pausePeriod;

      timerRef.current = setTimeout(step, Math.max(8, delay));
    };

    step();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, enabled, speed, pauseComma, pausePeriod, jitter]);

  // Blinking cursor.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return { displayText, isComplete, cursorVisible };
}
