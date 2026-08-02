import { useEffect, useState } from 'react';
import config from '../data/config';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { Scene } from '../components/Stage/Stage';
import { LoveJar } from '../components/Cards/LoveJar';

const NOTE_MS = 2200;

// Slips leave the jar one at a time and unfold beside it, looping so the
// section reads well whether it is watched for five seconds or fifty.
export function LoveJarSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const [index, setIndex] = useState(-1);
  const reasons = config.loveJar.reasons;

  useEffect(() => {
    if (!isVisible) return undefined;

    setIndex(0);
    if (prefersReducedMotion()) return undefined;

    let n = 0;
    const id = setInterval(() => {
      n = (n + 1) % reasons.length;
      setIndex(n);
    }, NOTE_MS);
    return () => clearInterval(id);
  }, [isVisible, reasons.length]);

  // The pile drains as notes come out, then refills when the loop restarts.
  const remaining = index < 0 ? reasons.length : reasons.length - 1 - index;

  return (
    <Scene id="loveJar" ariaLabel={config.loveJar.ariaLabel} sectionRef={ref}>
      <LoveJar
        heading={config.loveJar.heading}
        reasons={reasons}
        activeIndex={index}
        remaining={remaining}
        isVisible={isVisible}
      />
    </Scene>
  );
}
