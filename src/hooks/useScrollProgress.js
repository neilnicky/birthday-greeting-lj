import { useEffect, useState } from 'react';

// Tracks scroll position as 0-1 and the index of the most-visible section.
// Sections are queried by the [data-section] attribute. rAF throttled.
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    let ticking = false;

    const measure = () => {
      ticking = false;

      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0);

      const sections = document.querySelectorAll('[data-section]');
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      sections.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = idx;
        }
      });
      setActiveSection(best);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { progress, activeSection };
}
