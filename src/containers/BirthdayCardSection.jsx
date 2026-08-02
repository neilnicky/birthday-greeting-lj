import { useEffect, useRef } from 'react';
import config from '../data/config';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParticles } from '../hooks/useParticles';
import { Scene } from '../components/Stage/Stage';
import { BirthdayCard } from '../components/Cards/BirthdayCard';

// Assembles the greeting from config; fires confetti once on reveal.
export function BirthdayCardSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const particleRef = useRef(null);
  const { emit } = useParticles(particleRef);
  const fired = useRef(false);

  useEffect(() => {
    if (!isVisible || fired.current || !config.effects.particles) return;
    fired.current = true;
    emit({
      type: 'confetti',
      count: 44,
      origin: { x: 0.5, y: 0.1 },
      spread: 150,
      velocity: { min: 5, max: 12 },
      lifetime: 2400,
      gravity: 0.18,
      colors: [
        config.theme.inkRed,
        config.theme.gold,
        config.theme.goldLight,
        config.theme.notePink,
        config.theme.cardColor,
      ],
      shapes: ['square', 'circle', 'star'],
      size: { min: 7, max: 13 },
      spin: 10,
    });
  }, [isVisible, emit]);

  return (
    <Scene id="birthdayCard" ariaLabel={config.birthdayCard.ariaLabel} sectionRef={ref}>
      <div className="scene__particles" ref={particleRef} />
      <BirthdayCard
        heading={config.birthdayCard.heading}
        name={config.name}
        date={config.date}
        isVisible={isVisible}
      />
    </Scene>
  );
}
