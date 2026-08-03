import { useEffect, useState, useCallback } from 'react';
import config from './data/config';

import { useScrollProgress } from './hooks/useScrollProgress';
import { useFloatingHearts } from './hooks/useFloatingHearts';
import { useAudio } from './hooks/useAudio';
import { useSectionNav } from './hooks/useSectionNav';

import { ProgressBar } from './components/UI/ProgressBar';
import { SectionDots } from './components/UI/SectionDots';
import { MusicPlayer } from './components/UI/MusicPlayer';
import { SpotifyPlayer } from './components/UI/SpotifyPlayer';
import { ScrollHint } from './components/UI/ScrollHint';
import { FeltBackdrop } from './components/Stage/FeltBackdrop';

import { EnvelopeOverlay } from './containers/EnvelopeOverlay';
import { BirthdayCardSection } from './containers/BirthdayCardSection';
import { LoveLetterSection } from './containers/LoveLetterSection';
import { FlowersSection } from './containers/FlowersSection';
import { MakeAWishSection } from './containers/MakeAWishSection';
import { FilmStripSection } from './containers/FilmStripSection';
import { PhotoGallerySection } from './containers/PhotoGallerySection';
import { LoveJarSection } from './containers/LoveJarSection';
import { CouponSection } from './containers/CouponSection';
import { ClawMachineSection } from './containers/ClawMachineSection';
import { QRCodeSection } from './containers/QRCodeSection';

// Registry: section id → container component.
// `envelope` is deliberately absent — it is chrome layered over every section,
// not a scroll step of its own.
const SECTION_COMPONENTS = {
  birthdayCard: BirthdayCardSection,
  letter: LoveLetterSection,
  flowers: FlowersSection,
  wish: MakeAWishSection,
  filmStrip: FilmStripSection,
  photoGallery: PhotoGallerySection,
  loveJar: LoveJarSection,
  coupon: CouponSection,
  clawMachine: ClawMachineSection,
  qrCode: QRCodeSection,
};

// Section id → its aria label (content lives in config, this is just wiring).
const SECTION_ARIA = {
  birthdayCard: config.birthdayCard.ariaLabel,
  letter: config.letter.ariaLabel,
  flowers: config.flowers.ariaLabel,
  wish: config.wish.ariaLabel,
  filmStrip: config.photos.filmAriaLabel,
  photoGallery: config.photos.galleryAriaLabel,
  loveJar: config.loveJar.ariaLabel,
  coupon: config.coupon.ariaLabel,
  clawMachine: config.claw.ariaLabel,
  qrCode: config.qr.ariaLabel,
};

// Push config values onto the CSS custom properties the stylesheets read.
function applyTheme({ theme, fonts, stage }) {
  const root = document.documentElement.style;

  const vars = {
    '--felt': theme.feltColor,
    '--felt-shadow': theme.feltShadow,
    '--envelope-red': theme.envelopeRed,
    '--envelope-shade': theme.envelopeShade,
    '--card': theme.cardColor,
    '--card-pink': theme.cardPinkColor,
    '--note-pink': theme.notePink,
    '--ink-red': theme.inkRed,
    '--ink-navy': theme.inkNavy,
    '--ink-black': theme.inkBlack,
    '--gold-light': theme.goldLight,
    '--gold': theme.gold,
    '--gold-dark': theme.goldDark,

    '--font-script': fonts.script,
    '--font-hand': fonts.hand,
    '--font-rounded': fonts.rounded,
    '--font-marker': fonts.marker,

    // Candidates only — Stage.css picks between them per orientation. Setting
    // --stage-ratio here would beat the portrait media query.
    '--stage-ratio-landscape': String(stage.ratio),
    '--stage-ratio-portrait': String(stage.portraitRatio),
    '--card-w': String(stage.cardWidth),
    '--card-h': String(stage.cardHeight),
    '--card-offset-y': String(stage.cardOffsetY),
    '--seal-width': String(stage.sealWidth),
    '--seal-height': String(stage.sealHeight),
    '--seal-top': String(stage.sealTop),
    '--pocket-h': String(stage.pocketHeight),
    '--pocket-w': String(stage.pocketWidth),
  };

  Object.entries(vars).forEach(([key, value]) => root.setProperty(key, value));
}

// Fonts are config-driven, so the Google Fonts request is built at runtime
// rather than hard-coded in an @import.
function loadFonts(families) {
  if (!families) return;
  const id = 'greeting-fonts';
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
  document.head.appendChild(link);
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  const { progress, activeSection } = useScrollProgress();
  const heartsRef = useFloatingHearts(config.effects.floatingHearts);
  const audio = useAudio(config.music.src);

  useEffect(() => {
    applyTheme(config);
    loadFonts(config.fonts.googleFamilies);
  }, []);

  // The page is unscrollable until the envelope is opened.
  useEffect(() => {
    document.body.classList.toggle('is-sealed', !isOpen);
    return () => document.body.classList.remove('is-sealed');
  }, [isOpen]);

  // Sections that actually render (respects `enabled` + the photo gate).
  const hasGalleryPhotos = config.photos.items.some((p) => p.src && p.src.trim() !== '');
  const rendered = config.sections.filter(
    (s) =>
      s.enabled &&
      SECTION_COMPONENTS[s.id] &&
      !(s.id === 'photoGallery' && !hasGalleryPhotos),
  );

  const dots = rendered.map((s) => ({ id: s.id, label: SECTION_ARIA[s.id] }));

  const { goTo } = useSectionNav({
    activeIndex: activeSection,
    count: rendered.length,
    enabled: isOpen,
    autoplay: config.autoplay,
    isOpen,
  });

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    if (config.music.autoplayOnOpen && audio.enabled) audio.fadeIn();
  }, [audio]);

  return (
    <>
      <FeltBackdrop src={config.assets.felt} />
      {config.effects.floatingHearts ? (
        <div className="floating-hearts" ref={heartsRef} aria-hidden="true" />
      ) : null}

      {config.ui.showProgressBar ? <ProgressBar progress={progress} /> : null}

      <main className={isOpen ? 'deck is-open' : 'deck'}>
        {rendered.map((section) => {
          const Component = SECTION_COMPONENTS[section.id];
          return <Component key={section.id} />;
        })}
      </main>

      <EnvelopeOverlay isOpen={isOpen} onOpen={handleOpen} />

      {config.ui.showScrollHint ? (
        <ScrollHint text={config.envelope.scrollHint} visible={isOpen && activeSection === 0} />
      ) : null}

      {config.ui.showDots ? (
        <SectionDots
          dots={dots}
          activeIndex={activeSection}
          onDotClick={goTo}
          navLabel={config.ui.navLabel}
          hidden={!isOpen}
        />
      ) : null}

      {audio.enabled ? (
        <MusicPlayer
          isPlaying={audio.isPlaying}
          onToggle={audio.toggle}
          playLabel={config.music.playLabel}
          pauseLabel={config.music.pauseLabel}
        />
      ) : null}

      {/* Mounted only after the seal is broken — that click is the user gesture
          the embed needs if autoplay is going to work at all. */}
      {isOpen && !audio.enabled ? (
        <SpotifyPlayer
          url={config.music.spotifyUrl}
          label={config.music.spotifyLabel}
          startSeconds={config.music.spotifyStartSeconds}
          theme={config.music.spotifyTheme}
          height={config.music.spotifyHeight}
        />
      ) : null}
    </>
  );
}
