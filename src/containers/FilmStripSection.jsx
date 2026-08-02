import { useEffect, useState } from 'react';
import config from '../data/config';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { Scene } from '../components/Stage/Stage';
import { FilmStrip } from '../components/Cards/FilmStrip';

const FRAME_MS = 420;

// The strip pulls out of the canister and each frame develops in turn.
export function FilmStripSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });
  const [revealed, setRevealed] = useState(0);
  const total = config.photos.items.length;

  useEffect(() => {
    if (!isVisible) return undefined;
    if (prefersReducedMotion()) {
      setRevealed(total);
      return undefined;
    }

    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setRevealed(n);
      if (n >= total) clearInterval(id);
    }, FRAME_MS);
    return () => clearInterval(id);
  }, [isVisible, total]);

  return (
    <Scene id="filmStrip" ariaLabel={config.photos.filmAriaLabel} sectionRef={ref}>
      <FilmStrip
        heading={config.photos.heading}
        photos={config.photos.items}
        emptyHint={config.photos.emptyHint}
        placeholderText={config.photos.addPhotoPlaceholder}
        revealedCount={revealed}
        isVisible={isVisible}
      />
    </Scene>
  );
}
