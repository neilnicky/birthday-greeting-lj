import { useEffect, useMemo, useRef } from 'react';
import config from '../data/config';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParticles } from '../hooks/useParticles';
import { Scene } from '../components/Stage/Stage';
import { PhotoGallery } from '../components/Cards/PhotoGallery';
import { randomRotation } from '../utils/random';

// Renders only if there are photos with a src. Sparkle burst after they land.
export function PhotoGallerySection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const stageRef = useRef(null);
  const { emit } = useParticles(stageRef);
  const fired = useRef(false);

  const photos = useMemo(
    () => config.photos.items.filter((p) => p.src && p.src.trim() !== ''),
    [],
  );
  const rotations = useMemo(() => photos.map(() => randomRotation()), [photos]);

  useEffect(() => {
    if (!isVisible || fired.current || !photos.length || !config.effects.particles) {
      return undefined;
    }
    fired.current = true;
    const id = setTimeout(() => {
      emit({
        type: 'sparkle',
        count: 30,
        origin: { x: 0.5, y: 0.5 },
        spread: 360,
        velocity: { min: 3, max: 8 },
        lifetime: 1200,
        gravity: 0.05,
        colors: [config.theme.gold, config.theme.goldLight, config.theme.cardColor],
        shapes: ['star', 'circle'],
        size: { min: 5, max: 11 },
        spin: 8,
      });
    }, photos.length * 130 + 500);
    return () => clearTimeout(id);
  }, [isVisible, emit, photos.length]);

  // Conditional: nothing to show → render nothing.
  if (photos.length === 0) return null;

  return (
    <Scene id="photoGallery" ariaLabel={config.photos.galleryAriaLabel} sectionRef={ref}>
      <PhotoGallery
        heading={config.photos.galleryHeading}
        photos={photos}
        rotations={rotations}
        isVisible={isVisible}
        stageRef={stageRef}
      />
    </Scene>
  );
}
