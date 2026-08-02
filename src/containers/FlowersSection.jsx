import { useEffect, useRef } from 'react';
import config from '../data/config';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParticles } from '../hooks/useParticles';
import { Scene } from '../components/Stage/Stage';
import { FlowersCard } from '../components/Cards/FlowersCard';

// Rains petals across the card while the section is on screen.
export function FlowersSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const stageRef = useRef(null);
  const { emit } = useParticles(stageRef);

  useEffect(() => {
    if (!isVisible || !config.effects.particles) return undefined;
    const id = setInterval(() => {
      emit({
        type: 'petals',
        count: 2,
        origin: { x: Math.random(), y: -0.05 },
        spread: 40,
        velocity: { min: 1, max: 2.5 },
        lifetime: 3200,
        gravity: 0.04,
        colors: [config.theme.notePink, config.theme.inkRed, config.theme.cardPinkColor],
        shapes: ['petal'],
        size: { min: 8, max: 14 },
        spin: 3,
      });
    }, 300);
    return () => clearInterval(id);
  }, [isVisible, emit]);

  return (
    <Scene id="flowers" ariaLabel={config.flowers.ariaLabel} sectionRef={ref}>
      <FlowersCard
        heading={config.flowers.heading}
        bouquetSrc={config.assets.bouquet}
        isVisible={isVisible}
        stageRef={stageRef}
      />
    </Scene>
  );
}
