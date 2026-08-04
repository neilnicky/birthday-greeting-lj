import { useCallback } from 'react';
import config from '../data/config';
import { useParticles } from '../hooks/useParticles';
import { ClosedEnvelope } from '../components/Stage/ClosedEnvelope';
import { EnvelopeFrame } from '../components/Stage/EnvelopeFrame';

// Owns the envelope chrome that sits above every section: the sealed sheet
// that covers the page on load, and the frame (pocket + seal) that stays
// pinned once it opens. Open state is held by App because the frame outlives
// the first screen.
export function EnvelopeOverlay({ isOpen, onOpen, onClose }) {
  const { emit } = useParticles();

  const handleSealClick = useCallback(() => {
    // Re-sealing gets no sparkle burst — that flourish reads as a celebration,
    // which is the wrong note for putting the card away.
    if (isOpen) {
      onClose();
      return;
    }

    if (config.effects.particles) {
      emit({
        type: 'sparkle',
        count: 44,
        origin: { x: 0.5, y: 0.5 },
        spread: 360,
        velocity: { min: 3, max: 9 },
        lifetime: 1300,
        gravity: 0.08,
        colors: [config.theme.goldLight, config.theme.gold, config.theme.goldDark],
        shapes: ['star', 'circle'],
        size: { min: 6, max: 13 },
        spin: 8,
      });
    }

    onOpen();
  }, [isOpen, emit, onOpen, onClose]);

  return (
    <>
      <ClosedEnvelope isOpen={isOpen} hintText={config.envelope.hintText} />
      <EnvelopeFrame
        isOpen={isOpen}
        onSealClick={handleSealClick}
        sealAriaLabel={config.envelope.sealAriaLabel}
        sealCloseAriaLabel={config.envelope.sealCloseAriaLabel}
        sealSrc={config.assets.seal}
        goldLight={config.theme.goldLight}
        gold={config.theme.gold}
        goldDark={config.theme.goldDark}
      />
    </>
  );
}
