import { useCallback, useEffect, useRef } from 'react';
import { prefersReducedMotion } from './useReducedMotion';

const STEP_BACK = ['ArrowUp', 'ArrowLeft', 'PageUp'];
const STEP_FORWARD = ['ArrowDown', 'ArrowRight', 'PageDown'];

function sectionNodes() {
  return Array.from(document.querySelectorAll('[data-section]'));
}

// Keyboard / TV-remote navigation plus optional hands-free autoplay.
//
// Televisions have no scroll wheel: remotes emit arrow keys and Enter, which is
// what this maps. Autoplay walks the sections on a timer and cancels for good
// on the first sign of a real person (key, wheel, pointer, touch).
//
// Escape is handled here rather than in a listener of its own: this effect
// already owns a keydown handler gated on the same `enabled` flag.
export function useSectionNav({
  activeIndex,
  count,
  enabled = true,
  autoplay = { enabled: false, sectionMs: 8000, startAfterOpen: true },
  isOpen = false,
  onEscape,
}) {
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;

  const countRef = useRef(count);
  countRef.current = count;

  const cancelledRef = useRef(false);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    const nodes = sectionNodes();
    const clamped = Math.max(0, Math.min(nodes.length - 1, index));
    const node = nodes[clamped];
    if (!node) return;
    node.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
  }, []);

  const step = useCallback(
    (delta) => {
      goTo(activeRef.current + delta);
    },
    [goTo],
  );

  // ── Keyboard / remote ──
  useEffect(() => {
    if (!enabled) return undefined;

    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;

      // Never hijack keys aimed at a control the user has focused.
      const target = event.target;
      const isControl =
        target instanceof HTMLElement &&
        (target.tagName === 'BUTTON' || target.tagName === 'A' || target.isContentEditable);
      if (isControl && (event.key === 'Enter' || event.key === ' ')) return;

      if (STEP_FORWARD.includes(event.key)) {
        event.preventDefault();
        step(1);
      } else if (STEP_BACK.includes(event.key)) {
        event.preventDefault();
        step(-1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goTo(countRef.current - 1);
      } else if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, step, goTo, onEscape]);

  // ── Autoplay ──
  useEffect(() => {
    if (!autoplay.enabled) return undefined;
    if (prefersReducedMotion()) return undefined;
    if (autoplay.startAfterOpen && !isOpen) return undefined;
    if (cancelledRef.current) return undefined;

    const stop = () => {
      cancelledRef.current = true;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    timerRef.current = setInterval(() => {
      const next = activeRef.current + 1;
      if (next >= countRef.current) {
        stop();
        return;
      }
      goTo(next);
    }, autoplay.sectionMs);

    const events = ['keydown', 'wheel', 'pointerdown', 'touchstart'];
    events.forEach((name) => window.addEventListener(name, stop, { passive: true }));

    return () => {
      events.forEach((name) => window.removeEventListener(name, stop));
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay.enabled, autoplay.sectionMs, autoplay.startAfterOpen, isOpen, goTo]);

  return { goTo, step };
}
