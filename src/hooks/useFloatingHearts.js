import { useEffect, useRef } from 'react';
import { randomBetween, randomInt, randomPick } from '../utils/random';
import { prefersReducedMotion } from './useReducedMotion';

// Background floating hearts layer. Decorative only — chars/colors are
// internal defaults, NOT content config.
const HEART_CHARS = ['♥', '❤', '♡'];
const HEART_COLORS = [
  'rgba(255,255,255,0.35)',
  'rgba(255,200,210,0.4)',
  'rgba(223,192,106,0.35)',
  'rgba(212,43,43,0.4)',
];
const MAX_HEARTS = 15;

export function useFloatingHearts(enabled = true) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    if (prefersReducedMotion()) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    let count = 0;
    let stopped = false;

    const spawn = () => {
      if (stopped || count >= MAX_HEARTS) return;
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = randomPick(HEART_CHARS);

      const size = randomInt(14, 30);
      const duration = randomBetween(10, 16);
      const drift = randomBetween(-40, 40);

      heart.style.left = `${randomBetween(0, 100)}%`;
      heart.style.fontSize = `${size}px`;
      heart.style.color = randomPick(HEART_COLORS);
      heart.style.setProperty('--drift', `${drift}px`);
      heart.style.animationDuration = `${duration}s`;

      container.appendChild(heart);
      count += 1;

      heart.addEventListener('animationend', () => {
        heart.remove();
        count -= 1;
      });
    };

    const id = setInterval(spawn, 1000);
    spawn();

    return () => {
      stopped = true;
      clearInterval(id);
      if (container) container.innerHTML = '';
    };
  }, [enabled]);

  return containerRef;
}
