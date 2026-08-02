import { useEffect, useRef, useState, useCallback } from 'react';
import config from '../data/config';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParticles } from '../hooks/useParticles';
import { Scene } from '../components/Stage/Stage';
import { WishCard } from '../components/Cards/WishCard';

// Orchestrates the blow-out: flame out → smoke → three fireworks → flash →
// relight after three seconds so it can be replayed.
export function MakeAWishSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.25 });
  const particleRef = useRef(null);
  const { emit } = useParticles(particleRef);
  const [hasBlown, setHasBlown] = useState(false);
  const [flash, setFlash] = useState(false);
  const timers = useRef([]);

  const firework = useCallback(
    (origin) => {
      if (!config.effects.particles) return;
      emit({
        type: 'firework',
        count: 26,
        origin,
        spread: 360,
        velocity: { min: 4, max: 10 },
        lifetime: 1400,
        gravity: 0.1,
        colors: [
          config.theme.inkRed,
          config.theme.gold,
          config.theme.goldLight,
          config.theme.notePink,
          config.theme.cardColor,
        ],
        shapes: ['circle', 'star'],
        size: { min: 5, max: 10 },
        spin: 6,
        trail: true,
      });
    },
    [emit],
  );

  const handleBlow = useCallback(() => {
    if (hasBlown) return;
    setHasBlown(true);
    setFlash(true);
    timers.current.push(setTimeout(() => setFlash(false), 320));

    firework({ x: 0.5, y: 0.45 });
    timers.current.push(setTimeout(() => firework({ x: 0.28, y: 0.35 }), 200));
    timers.current.push(setTimeout(() => firework({ x: 0.72, y: 0.35 }), 400));
    timers.current.push(setTimeout(() => setHasBlown(false), 3000));
  }, [hasBlown, firework]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const buttonLabel = hasBlown ? config.wish.blownMessage : config.wish.blowButtonLabel;

  return (
    <Scene id="wish" ariaLabel={config.wish.ariaLabel} sectionRef={ref}>
      <div className="scene__particles" ref={particleRef} />
      <div className={`wish-flash ${flash ? 'is-on' : ''}`} aria-hidden="true" />
      <WishCard
        heading={config.wish.heading}
        subtext={config.wish.subtext}
        buttonLabel={buttonLabel}
        hasBlown={hasBlown}
        onBlow={handleBlow}
        isVisible={isVisible}
      />
    </Scene>
  );
}
