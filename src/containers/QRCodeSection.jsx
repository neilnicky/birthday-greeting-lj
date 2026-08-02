import { useEffect, useRef } from 'react';
import config from '../data/config';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParticles } from '../hooks/useParticles';
import { Scene } from '../components/Stage/Stage';
import { QRCard } from '../components/Cards/QRCard';

// Gentle confetti rain over the closing card.
export function QRCodeSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const particleRef = useRef(null);
  const { emit } = useParticles(particleRef);

  useEffect(() => {
    if (!isVisible || !config.effects.particles) return undefined;
    const id = setInterval(() => {
      emit({
        type: 'confetti',
        count: 2,
        origin: { x: Math.random(), y: -0.05 },
        spread: 30,
        velocity: { min: 1, max: 2.5 },
        lifetime: 3600,
        gravity: 0.03,
        colors: [
          config.theme.gold,
          config.theme.goldLight,
          config.theme.notePink,
          config.theme.inkRed,
        ],
        shapes: ['square', 'circle'],
        size: { min: 5, max: 9 },
        spin: 4,
      });
    }, 400);
    return () => clearInterval(id);
  }, [isVisible, emit]);

  return (
    <Scene id="qrCode" ariaLabel={config.qr.ariaLabel} sectionRef={ref}>
      <div className="scene__particles" ref={particleRef} />
      <QRCard
        heading={config.qr.heading}
        url={config.qr.url}
        fallbackText={config.qr.fallbackText}
        isVisible={isVisible}
      />
      {config.credit.show ? (
        <a
          className="credit"
          href={config.credit.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {config.credit.text}
        </a>
      ) : null}
    </Scene>
  );
}
