// src/data/config.js
// ═══════════════════════════════════════════════════════════
//  SINGLE SOURCE OF TRUTH — Edit this file to customize
//  for each client. No other file needs to be touched.
//  ZERO user-facing content strings live outside this file.
// ═══════════════════════════════════════════════════════════

const config = {

  // ── Recipient ──
  name: 'Boyfriend',
  date: '04.08.2026',

  // ── Envelope section ──
  envelope: {
    hintText: 'tap to open ♥',
    scrollHint: 'scroll down ↓',
    sealAriaLabel: 'Open the envelope',
  },

  // ── Birthday card section ──
  birthdayCard: {
    ariaLabel: 'Birthday card',
    heading: 'Happy birthday',
    // Final display: "{heading} {name}" — assembled in container
  },

  // ── Love letter section ──
  letter: {
    ariaLabel: 'Love letter',
    greeting: 'My Baba,',
    paragraphs: [
      'Happy birthday, Monu. Twenty-five years ago the world got a little sweeter — and somehow it ended up handing you to me.',
      'I’ve watched you stay calm when nothing around you is, and start over on something because "almost right" was never enough. That patient, stubborn heart is the same one you turn on me every day.',
      'Whatever you’re chasing this year, I’m behind all of it. Happy birthday, my Baba.',
    ],
    signature: '— Your Liya ♥',
  },

  // ── Flowers section ──
  flowers: {
    ariaLabel: 'Flowers for you',
    heading: 'Flowers for you, always ♥',
  },

  // ── Wish section ──
  wish: {
    ariaLabel: 'Make a wish',
    heading: 'Close your eyes and make a wish',
    subtext: 'Blow out your candle!',
    blowButtonLabel: '✨ Tap to blow ✨',
    blownMessage: '🎉 Happy 25th, Jesley 🎉',
  },

  // ── Photos ──
  photos: {
    filmAriaLabel: 'Film strip of memories',
    galleryAriaLabel: 'Photo gallery',
    heading: 'Me + You =',
    galleryHeading: 'Our beautiful moments',
    addPhotoPlaceholder: 'add photo',
    emptyHint: 'add your favorite photos here ♥',
    items: [
      // ⚠ NEEDED: drop six images into public/photos/ and fill these in, e.g.
      //   { src: "/photos/photo1.jpg", alt: "Our first trip together" },
      // The `alt` is real copy — write it like a caption, not a filename.
      // A src pointing at a file that doesn't exist renders a broken image, so
      // leave these empty until the photos are actually in place.
      // If the photos don't make it in time, set `filmStrip` and `photoGallery`
      // to enabled: false below rather than shipping "add photo" placeholders.
      { src: '', alt: '' },
      { src: '', alt: '' },
      { src: '', alt: '' },
      { src: '', alt: '' },
      { src: '', alt: '' },
      { src: '', alt: '' },
    ],
  },

  // ── Reasons I love you ──
  loveJar: {
    ariaLabel: 'Jar of reasons',
    heading: 'Reasons why I love you',
    reasons: [
      // Keep these short — the jar note is a fixed 24u-wide slip, so anything
      // much past ~35 characters spills out of it.
      'How calm you stay in the chaos',
      'You never leave things half-done',
      'You feed everyone before yourself',
      'How you light up about your work',
      'Tired, and still asking about me',
      'You love with everything you have',
    ],
  },

  // ── Coupon ──
  coupon: {
    ariaLabel: 'Love coupon',
    // Ticket is a fixed 56u wide; the title must stay on one line or it
    // wraps into `forLine` below it. Keep it to ~12 characters.
    title: 'DAY OFF DUTY',
    forLine: 'For my Baba',
    usesLabel: 'Uses',
    usesValue: 'Whenever',
    expiryLabel: 'Expiry',
    expiryValue: 'Never',
  },

  // ── Claw machine ──
  claw: {
    ariaLabel: 'Claw machine',
    intro: 'In a world of,',
    subtitle: 'but you are a:',
    gemText: 'GEM',
    // Order matters: ClawMachine's PILE puts index 0 and 3 on the small hearts,
    // 1 and 2 on the big ones. Long labels go in the middle.
    traits: ['Frozen', 'Store-bought', 'Instant mix', 'Rushed'],
  },

  // ── QR Code ──
  qr: {
    ariaLabel: 'QR code',
    heading: 'All our memories, in one place',
    // ⚠ NEEDED: paste the shared photo album link here (Google Photos / Drive).
    // While this is empty the card shows `fallbackText` instead of a QR.
    url: '',
    fallbackText: 'Set your URL in config to generate QR',
  },

  // ── Music ──
  music: {
    src: '',                           // Path to mp3 (e.g. "/music/song.mp3"). Empty = no music button.
    autoplayOnOpen: false,             // Start playing when envelope opens
    playLabel: 'Play background music',
    pauseLabel: 'Pause background music',

    // ⚠ NEEDED: paste the Spotify track link here, e.g.
    //   https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
    // Empty = no player rendered at all.
    // Note: Spotify's embed will very likely need one tap to start — browsers
    // block cross-origin autoplay, and logged-out listeners get a 30s preview.
    spotifyUrl: '',
    spotifyLabel: 'Our song',
  },

  // ── Global UI labels + chrome toggles ──
  // The reference design shows no progress bar / floating hearts, so those
  // default to off. Dot nav stays on because it doubles as TV/remote navigation.
  ui: {
    navLabel: 'Jump to section',
    showDots: true,
    showProgressBar: false,
    // The reference card has no scroll cue once the envelope is open — the
    // card fills the screen edge to edge and there is nowhere to put one.
    showScrollHint: false,
  },

  // ── Ambient effects ──
  effects: {
    floatingHearts: false,             // Background hearts rising behind the card
    particles: true,                   // Confetti / petals / sparkle bursts
  },

  // ── Hands-free playback (TV mode) ──
  // Advances one section every `sectionMs`. Any key, wheel, pointer or touch
  // input cancels it permanently. Always disabled under prefers-reduced-motion.
  autoplay: {
    enabled: false,
    sectionMs: 8000,
    startAfterOpen: true,
  },

  // ── Optional raster overrides ──
  // Every visual is drawn procedurally (SVG + CSS) by default. Drop a file in
  // public/ and point at it here to swap in real artwork — no code change.
  assets: {
    seal: '/assets/wax-seal.webp',     // cut out of the reference art by scripts/extract-wax-seal.mjs
    felt: '',                          // e.g. "/assets/red-felt.jpg"
    paper: '',                         // e.g. "/assets/blue-paper.jpg"
    bouquet: '',                       // e.g. "/assets/rose-bouquet.png"
  },

  // ── Stage geometry ──
  // The whole scene is locked to one aspect ratio and scaled to fit the
  // viewport, so the composition is identical on a laptop and on an 8K TV.
  // All values below are percentages of the stage width unless noted.
  stage: {
    ratio: 1.6,                        // 16:10, matches the reference recording
    portraitRatio: 0.78,               // Used when the viewport is taller than wide
    cardWidth: 76,                     // % of stage width
    cardHeight: 84,                    // % of stage height
    cardOffsetY: 5,                    // % of stage height the card sits below centre
    // The reference seal is a wide oval, so width and height are independent.
    sealWidth: 28,                     // % of stage width
    sealHeight: 27,                    // % of stage height
    sealTop: 1,                        // % of stage height from the top edge
    pocketHeight: 30,                  // % of stage height the bottom flaps rise to
    pocketWidth: 33,                   // % of stage width each bottom flap spans
  },

  // ── Branding / Credit ──
  credit: {
    show: true,
    text: 'Made with ♥ by Liyaa  ',
    url: '',                           // Empty = plain text, not a link.
  },

  // ── Theme ──
  // Sampled from the reference video. It was filmed off a laptop screen, so
  // these are calibrated approximations rather than exact source values.
  theme: {
    feltColor: '#c4202f',              // Textured fabric backdrop
    feltShadow: '#8d121d',             // Vignette / weave shadow
    envelopeRed: '#f32c41',            // Flat envelope paper: pocket, flaps, closed state
    envelopeShade: '#d81f33',          // Fold shading on the closed envelope
    cardColor: '#b9def2',              // Pale ice-blue letter paper
    cardPinkColor: '#d9a6dd',          // Coupon ticket
    notePink: '#e9a7c0',               // Love-jar notes
    inkRed: '#d8323f',                 // Script, doodles, most line art
    inkNavy: '#2c3e6b',                // Jar, cake, letter body
    inkBlack: '#141414',               // Claw arm, heart labels
    goldLight: '#f5e2a8',
    gold: '#d9b45c',
    goldDark: '#8f6c1e',
  },

  // ── Fonts ──
  // Closest Google Fonts to the reference lettering. Swap freely — the whole
  // type system reads from here. Keep `googleFamilies` in sync with the names.
  fonts: {
    script: "'Sacramento', 'Dancing Script', cursive",
    hand: "'Coming Soon', 'Patrick Hand', cursive",
    rounded: "'Baloo 2', system-ui, sans-serif",
    marker: "'Caveat', cursive",
    googleFamilies:
      'Sacramento&family=Dancing+Script:wght@600;700&family=Coming+Soon&family=Baloo+2:wght@500;600;800&family=Caveat:wght@600;700',
  },

  // ── Section order (for dot nav labels + conditional rendering) ──
  // Sections with enabled: false are skipped entirely.
  // The envelope is not listed: it is chrome layered over every section
  // (sealed sheet on load, then the pinned frame), not a scroll step.
  sections: [
    { id: 'birthdayCard', enabled: true },
    { id: 'letter',       enabled: true },
    { id: 'flowers',      enabled: true },
    { id: 'wish',         enabled: true },
    { id: 'filmStrip',    enabled: true },
    { id: 'photoGallery', enabled: true },  // Auto-disabled if no photos have src
    { id: 'loveJar',      enabled: true },
    { id: 'coupon',       enabled: true },
    { id: 'clawMachine',  enabled: true },
    { id: 'qrCode',       enabled: true },
  ],
};

export default config;
