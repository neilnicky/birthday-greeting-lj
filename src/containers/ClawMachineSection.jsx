import { useEffect, useRef, useState } from 'react';
import config from '../data/config';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParticles } from '../hooks/useParticles';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { Scene } from '../components/Stage/Stage';
import { ClawMachine } from '../components/Cards/ClawMachine';

// Sequences the grab: the claw drops, closes on the gem heart, then lifts it
// clear of the pile with a sparkle burst.
const STEPS = [
  ['drop', 900],
  ['grip', 500],
  ['lift', 0],
];

export function ClawMachineSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.25 });
  const particleRef = useRef(null);
  const { emit } = useParticles(particleRef);
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    if (!isVisible) return undefined;
    if (prefersReducedMotion()) {
      setPhase('lift');
      return undefined;
    }

    const timers = [];
    let elapsed = 0;
    STEPS.forEach(([name, hold]) => {
      timers.push(setTimeout(() => setPhase(name), elapsed));
      elapsed += hold;
    });

    if (config.effects.particles) {
      timers.push(
        setTimeout(() => {
          emit({
            type: 'sparkle',
            count: 26,
            origin: { x: 0.5, y: 0.5 },
            spread: 360,
            velocity: { min: 2, max: 6 },
            lifetime: 1200,
            gravity: 0.04,
            colors: [config.theme.gold, config.theme.goldLight, config.theme.inkRed],
            shapes: ['star', 'circle'],
            size: { min: 5, max: 11 },
            spin: 8,
          });
        }, elapsed),
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [isVisible, emit]);

  const c = config.claw;

  return (
    <Scene id="clawMachine" ariaLabel={c.ariaLabel} sectionRef={ref}>
      <div className="scene__particles" ref={particleRef} />
      <ClawMachine
        intro={c.intro}
        subtitle={c.subtitle}
        gemText={c.gemText}
        traits={c.traits}
        phase={phase}
        isVisible={isVisible}
      />
    </Scene>
  );
}
