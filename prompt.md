# Birthday Greeting Website — Build Spec

Build an interactive birthday greeting website using **Vite + React**. Deploy target is static hosting (Cloudflare Pages, Vercel, Netlify — just `npm run build` → `dist/`).

Only external dependencies: Google Fonts (via CSS import), `qrcode.react` for QR generation, and no UI libraries. Vanilla CSS (no Tailwind, no styled-components). All animations are CSS + vanilla JS via hooks.

---

## ARCHITECTURE: STRICT COMPONENT-CONTAINER + SINGLE DATA SOURCE

### The Iron Rule

**ZERO content strings in any component or container file.** Not a heading, not a label, not a button text, not an aria-label, not a placeholder, not an emoji. Every human-readable string comes from the data file and flows downward as props.

If you find yourself typing a string like `"scroll down"` or `"tap to open"` or `"Happy Birthday"` or `"♥"` inside a `.jsx` file — STOP. That string belongs in `data/config.js`.

### Project structure

```
birthday-greeting/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── (music file, photos go here)
│
├── src/
│   ├── main.jsx                    # ReactDOM.createRoot, renders <App />
│   ├── App.jsx                     # Top-level orchestrator (scroll system, observers)
│   ├── App.css                     # Global styles, CSS custom properties, reset
│   │
│   ├── data/
│   │   └── config.js               # ★ THE SINGLE SOURCE OF TRUTH ★
│   │
│   ├── containers/                 # Data-aware. Import config. Pass props to components.
│   │   ├── EnvelopeSection.jsx
│   │   ├── BirthdayCardSection.jsx
│   │   ├── LoveLetterSection.jsx
│   │   ├── FlowersSection.jsx
│   │   ├── MakeAWishSection.jsx
│   │   ├── FilmStripSection.jsx
│   │   ├── PhotoGallerySection.jsx
│   │   ├── LoveJarSection.jsx
│   │   ├── CouponSection.jsx
│   │   ├── ClawMachineSection.jsx
│   │   └── QRCodeSection.jsx
│   │
│   ├── components/                 # PURE presentational. Props only. No imports from data/.
│   │   ├── Envelope/
│   │   │   ├── Envelope.jsx        # Envelope visual + open animation
│   │   │   ├── WaxSeal.jsx         # Gold seal with pulse + crack
│   │   │   ├── LetterPreview.jsx   # Card that slides out on open
│   │   │   └── Envelope.css
│   │   │
│   │   ├── Cards/
│   │   │   ├── Card.jsx            # Base card shell (blue/pink bg, corner ornaments, inner border)
│   │   │   ├── BirthdayCard.jsx    # Cake SVG, tulips, confetti trigger
│   │   │   ├── LoveLetter.jsx      # Typewriter text renderer
│   │   │   ├── FlowersCard.jsx     # Bouquet SVG, kiss mark, petal rain
│   │   │   ├── WishCard.jsx        # Cake + candle + blow interaction
│   │   │   ├── FilmStrip.jsx       # Film canister + photo frames
│   │   │   ├── PhotoGallery.jsx    # Polaroid grid
│   │   │   ├── LoveJar.jsx         # Jar SVG + animated notes
│   │   │   ├── Coupon.jsx          # Ticket with notches, stamp, barcode
│   │   │   ├── ClawMachine.jsx     # Claw + heart + trait badges
│   │   │   ├── QRCard.jsx          # QR code + decorations
│   │   │   └── Cards.css
│   │   │
│   │   ├── UI/
│   │   │   ├── MusicPlayer.jsx     # Floating play/pause button
│   │   │   ├── ProgressBar.jsx     # Top scroll progress line
│   │   │   ├── SectionDots.jsx     # Right-side dot navigation
│   │   │   ├── ScrollHint.jsx      # "scroll down" bounce text
│   │   │   ├── CornerOrnament.jsx  # Reusable SVG corner flourish
│   │   │   └── UI.css
│   │   │
│   │   └── SVG/                    # Pure SVG illustration components — props for colors/sizes
│   │       ├── CakeSVG.jsx
│   │       ├── TulipBouquet.jsx
│   │       ├── RoseBouquet.jsx
│   │       ├── KissMark.jsx
│   │       ├── BalloonCluster.jsx
│   │       ├── MasonJar.jsx
│   │       ├── FilmCanister.jsx
│   │       ├── ClawArm.jsx
│   │       ├── HeartShape.jsx
│   │       ├── PartyPopper.jsx
│   │       ├── BuntingBanner.jsx
│   │       └── StickFigureCouple.jsx
│   │
│   ├── hooks/
│   │   ├── useScrollReveal.js      # IntersectionObserver for card entrances
│   │   ├── useTypewriter.js        # Character-by-character text reveal
│   │   ├── useParticles.js         # Particle system hook (confetti, sparkles, petals, fireworks)
│   │   ├── useFloatingHearts.js    # Background floating hearts
│   │   ├── useScrollProgress.js    # Scroll position as 0-1 value
│   │   └── useAudio.js             # Music play/pause/volume
│   │
│   └── utils/
│       ├── particlePhysics.js      # Particle spawn, update, cleanup functions (pure)
│       └── random.js               # randomBetween, randomPick, randomColor helpers
```

### Component-Container Contract

**Container files** (`containers/*.jsx`):
- Import from `data/config.js`
- Import the corresponding presentational component
- Extract relevant CONFIG fields
- Pass them as props to the component
- May contain hooks (useScrollReveal, useParticles, etc.)
- May contain interaction state (isOpen, hasBlown, etc.)
- Render the component with all data as props

```jsx
// containers/BirthdayCardSection.jsx — EXAMPLE PATTERN
import config from '../data/config';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParticles } from '../hooks/useParticles';
import { BirthdayCard } from '../components/Cards/BirthdayCard';

export function BirthdayCardSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });
  const { emit } = useParticles();

  // Fire confetti once on reveal
  useEffect(() => {
    if (isVisible) {
      emit({ type: 'confetti', count: 40, /* ... */ });
    }
  }, [isVisible]);

  return (
    <section ref={ref} className="card-section">
      <BirthdayCard
        name={config.name}
        date={config.date}
        isVisible={isVisible}
        // Every string/value the component needs comes from here
      />
    </section>
  );
}
```

**Component files** (`components/**/*.jsx`):
- Receive ALL data via props
- Render JSX + apply CSS classes
- Contain NO imports from `data/`
- Contain NO hardcoded user-facing strings
- May accept event handler props (onSealClick, onBlowCandle, etc.)
- May contain internal UI state (hover state, animation phase) but NOT data state

```jsx
// components/Cards/BirthdayCard.jsx — EXAMPLE PATTERN
export function BirthdayCard({ name, date, isVisible }) {
  return (
    <div className={`card ${isVisible ? 'visible' : ''}`}>
      <span className="card-date">{date}</span>
      {/* name is a prop, not a hardcoded string */}
      <h2 className="card-heading">{`Happy Birthday ${name}!`}</h2>
      {/* ^^^ WRONG: "Happy Birthday" is hardcoded content */}
    </div>
  );
}
```

**Wait — that example violates the rule.** "Happy Birthday" is a content string. Fix:

```js
// data/config.js
export default {
  // ...
  birthdayHeading: "Happy Birthday",  // or a template: "{name}'s Special Day"
  // ...
};
```

```jsx
// containers/BirthdayCardSection.jsx
<BirthdayCard
  heading={`${config.birthdayHeading} ${config.name}!`}
  date={config.date}
  isVisible={isVisible}
/>
```

```jsx
// components/Cards/BirthdayCard.jsx
export function BirthdayCard({ heading, date, isVisible }) {
  return (
    <div className={`card ${isVisible ? 'visible' : ''}`}>
      <span className="card-date">{date}</span>
      <h2 className="card-heading">{heading}</h2>
      {/* No string literals that a user would read */}
    </div>
  );
}
```

**This pattern applies to EVERYTHING**: button labels, aria-labels, placeholder text, hint text, emoji characters, section headings. If a human reads it on screen, it lives in config.js.

---

## THE DATA FILE: `data/config.js`

```js
// src/data/config.js
// ═══════════════════════════════════════════════════════════
//  SINGLE SOURCE OF TRUTH — Edit this file to customize
//  for each client. No other file needs to be touched.
// ═══════════════════════════════════════════════════════════

const config = {

  // ── Recipient ──
  name: "Boyfriend",
  from: "Your Love",
  date: "17.08.2025",

  // ── Envelope section ──
  envelope: {
    hintText: "tap to open ♥",
    scrollHint: "scroll down ↓",
    revealDate: "17.08.2025",
    revealHeading: "Happy Birthday",
    // revealHeading + name are combined by the container
  },

  // ── Birthday card section ──
  birthdayCard: {
    heading: "Happy Birthday",
    // Final display: "{heading} {name}!" — assembled in container
  },

  // ── Love letter section ──
  letter: {
    greeting: "Dear love,",
    paragraphs: [
      "Happy Birthday, my love. You make my world a happier place just by being in it. Every moment with you feels warm, fun, and special in its own way.",
      "On your birthday, I just want you to know how lucky I feel to have you in my life. You deserve all the happiness, love, and success in the world, today and always.",
      "I can't wait to make more beautiful memories with you. Love you endlessly ♥",
    ],
  },

  // ── Flowers section ──
  flowers: {
    heading: "Here are the flowers for you!!",
  },

  // ── Wish section ──
  wish: {
    heading: "Close your eyes and Make a wish!",
    subtext: "blow out your candles",
    blowButtonLabel: "✨ Tap to blow ✨",
    blownMessage: "🎉 Happy Birthday! 🎉",
  },

  // ── Photos ──
  photos: {
    heading: "Me + You = ♥",
    galleryHeading: "Our Beautiful Moments",
    addPhotoPlaceholder: "add photo",
    emptyHint: "add your favorite photos here ♥",
    items: [
      // { src: "/photos/photo1.jpg", alt: "Us at the beach" },
      // { src: "/photos/photo2.jpg", alt: "Coffee date" },
      // Empty array or objects with empty src = show placeholders
      { src: "", alt: "" },
      { src: "", alt: "" },
      { src: "", alt: "" },
      { src: "", alt: "" },
      { src: "", alt: "" },
      { src: "", alt: "" },
    ],
  },

  // ── Reasons I love you ──
  loveJar: {
    heading: "Reasons why I love you",
    reasons: [
      "You're always there for me",
      "You're a good listener",
      "The way you help others",
      "You're my greatest supporter",
      "Your smile lights up my world",
      "You make everything better",
    ],
  },

  // ── Coupon ──
  coupon: {
    title: "FREE KISSES",
    forLine: "For my love",
    usesLabel: "Uses",
    usesValue: "Unlimited",
    expiryLabel: "Expiry",
    expiryValue: "Never",
    stampText: "♥ APPROVED ♥",
  },

  // ── Claw machine ──
  claw: {
    intro: "In the world of,",
    subtitle: "but you are a:",
    gemText: "GEM",
    traits: ["Cheater", "Toxic Bf", "Gaslighter", "Narcissist"],
  },

  // ── QR Code ──
  qr: {
    heading: "Scan the QR code!",
    subtext: "with love, always ♥",
    url: "https://example.com",       // URL encoded into the QR
    fallbackText: "Set your URL in config to generate QR",
  },

  // ── Music ──
  music: {
    src: "",                           // Path to mp3 (e.g. "/music/song.mp3"). Empty = no music button.
    autoplayOnOpen: false,             // Start playing when envelope opens
    playLabel: "Play background music",
    pauseLabel: "Pause background music",
  },

  // ── Branding / Credit ──
  credit: {
    show: true,
    text: "Made with ♥ by EkoDev",
    url: "https://ekodev.in",
  },

  // ── Theme ──
  theme: {
    bgColor: "#b01e1e",
    bgColorLight: "#c92e2e",
    cardColor: "#dceef8",
    cardPinkColor: "#f0c8d0",
    accentRed: "#d42b2b",
    textRed: "#c0392b",
    textDark: "#6b2c2c",
    goldLight: "#dfc06a",
    gold: "#c5a44e",
    goldDark: "#a8872e",
  },

  // ── Section order (for dot nav labels + conditional rendering) ──
  // Sections with enabled: false are skipped entirely
  sections: [
    { id: "envelope",     enabled: true },
    { id: "birthdayCard", enabled: true },
    { id: "letter",       enabled: true },
    { id: "flowers",      enabled: true },
    { id: "wish",         enabled: true },
    { id: "filmStrip",    enabled: true },
    { id: "photoGallery", enabled: true },  // Auto-disabled if no photos have src
    { id: "loveJar",      enabled: true },
    { id: "coupon",       enabled: true },
    { id: "clawMachine",  enabled: true },
    { id: "qrCode",       enabled: true },
  ],
};

export default config;
```

---

## DESIGN SYSTEM (CSS)

### CSS Custom Properties (set from config.theme in App.jsx or main.jsx)

```css
:root {
  --bg: #b01e1e;
  --bg-light: #c92e2e;
  --card: #dceef8;
  --card-pink: #f0c8d0;
  --accent-red: #d42b2b;
  --text-red: #c0392b;
  --text-dark: #6b2c2c;
  --gold-light: #dfc06a;
  --gold: #c5a44e;
  --gold-dark: #a8872e;
}
```

On mount, JS reads `config.theme` and applies each value to `document.documentElement.style.setProperty(...)`. Every CSS rule references these variables — never hardcoded hex values in CSS.

### Typography (Google Fonts — loaded via CSS @import in App.css)
- **Display/headings**: `"Dancing Script"` weight 600-700
- **Body**: `"Caveat"` weight 400-600
- **Utility**: `"Patrick Hand"`

### Base card component styling (Card.jsx + Card.css)
- Max-width: 580px, width: 90vw
- Background: `var(--card)`
- Border-radius: 14px
- Padding: clamp(28px, 5vw, 48px)
- Box-shadow: `0 20px 60px rgba(0,0,0,0.3), 0 2px 10px rgba(0,0,0,0.15)`
- Inner decorative border: `::before` pseudo-element, inset 12px, 1.5px solid `var(--text-red)` at 0.15 opacity
- Accepts `variant` prop: `"blue"` (default) | `"pink"`
- Accepts `ornaments` prop: array of positions `["tl","tr","bl","br"]` to render CornerOrnament components
- CornerOrnament: a small inline SVG curly flourish (hand-drawn bezier swirl), not emoji

### Background
- Fixed red gradient: `linear-gradient(135deg, var(--bg), var(--bg-light) 30%, var(--bg) 60%, var(--bg-light))`
- Felt texture overlay: repeating tiny SVG dot pattern at 0.5 opacity (data URI in CSS)
- Rendered once in App.jsx as a fixed `div.page-bg`

---

## HOOKS (the animation backbone)

### `useScrollReveal(options)`
```
Input:  { threshold: 0.15, rootMargin: '0px' }
Output: { ref, isVisible }
```
- Returns a ref to attach to the section element
- Uses IntersectionObserver
- Sets isVisible to true when element enters viewport (one-shot — disconnects after trigger)
- The card CSS handles the actual animation via `.visible` class

Card entrance animation (in Cards.css):
```css
.card {
  opacity: 0;
  transform: translateY(80px) scale(0.92) rotateX(8deg);
  filter: blur(6px);
  transition: 
    opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.card.visible {
  opacity: 1;
  transform: translateY(0) scale(1) rotateX(0);
  filter: blur(0);
}
/* Staggered children */
.card.visible > *:nth-child(1) { transition-delay: 0ms; }
.card.visible > *:nth-child(2) { transition-delay: 100ms; }
.card.visible > *:nth-child(3) { transition-delay: 200ms; }
.card.visible > *:nth-child(4) { transition-delay: 300ms; }
.card.visible > *:nth-child(5) { transition-delay: 400ms; }
```

### `useParticles(containerRef)`
```
Input:  ref to the DOM container where particles spawn
Output: { emit(options) }

emit options:
  type: 'confetti' | 'sparkle' | 'hearts' | 'petals' | 'firework'
  count: number
  origin: { x: 0-1, y: 0-1 }  // normalized to container
  spread: degrees (360 = all directions)
  velocity: { min, max }
  lifetime: ms
  gravity: px/frame²
  colors: string[]
  shapes: ('circle'|'square'|'heart'|'star'|'petal')[]
  size: { min, max }
  spin: deg/frame
  fadeOut: boolean
  trail: boolean  // spawn smaller trailing particles
```
- Particles are absolutely-positioned divs
- Animated via requestAnimationFrame (not CSS animations) for smooth 60fps
- Max 80 concurrent particles — skip new spawns if at cap
- Cleanup: remove from DOM when lifetime expires

### `useTypewriter(text, options)`
```
Input:  text (string), { speed: 25, pauseComma: 100, pausePeriod: 200, jitter: 8, enabled: boolean }
Output: { displayText, isComplete, cursorVisible }
```
- Returns displayText that grows character by character
- Natural pauses at punctuation
- Speed jitter for human feel
- Blinking cursor state
- Only runs when enabled=true (tied to isVisible from container)

### `useFloatingHearts()`
- Manages the background floating hearts layer
- Spawns hearts at intervals into a fixed-position container
- Returns a portal-target ref or directly appends to body
- Configurable spawn rate, heart characters, colors, speeds from internal defaults (not from config — these are decorative, not content)

### `useScrollProgress()`
```
Output: { progress: 0-1, activeSection: number }
```
- Tracks scroll position as normalized value
- Determines which section is currently most visible
- Throttled via rAF
- Used by ProgressBar and SectionDots

### `useAudio(src)`
```
Input:  src (string, path to audio file)
Output: { isPlaying, play, pause, toggle, fadeIn }
```
- Wraps HTMLAudioElement
- fadeIn: ramps volume from 0 to 0.6 over 1s
- Returns null/noop if src is empty

---

## SECTIONS — DETAILED SPECS

### Global: Each section
- `<section>` with `min-height: 100vh`, flex center, `scroll-snap-align: start`, padding 40px 20px
- Wrapped by its container which provides data + manages reveal

---

### 1. ENVELOPE (EnvelopeSection → Envelope, WaxSeal, LetterPreview)

**Container** manages: `isOpened` state, `onSealClick` handler, triggers music on open.

**Props to Envelope**: `isOpened`, `onSealClick`, `hintText`, `scrollHintText`, `revealDate`, `revealHeading`, `recipientName`

**Envelope component:**
- Red body with diagonal fold X pattern (CSS gradients)
- Top flap: clip-path triangle, rotateX(180deg) when `isOpened`
- Bottom flap: darker triangle
- WaxSeal: gold radial gradient, scalloped outer edge, heart embossed
  - Idle: breathing pulse scale(1→1.03→1), 2.5s loop
  - On click → parent sets isOpened=true
  - Opened: scale(0.6) translateY(-120%) opacity(0), 600ms
  - Emit gold sparkles from seal center on crack (useParticles in container)
- LetterPreview: slides up from envelope (translateY(-60%)) when opened
  - Shows: `revealDate` + `revealHeading` + `recipientName`
- Hint text below (fades on open)
- Scroll hint (appears after open, bounces)

---

### 2. BIRTHDAY CARD (BirthdayCardSection → BirthdayCard, CakeSVG, TulipBouquet)

**Container**: passes `heading` (assembled from `config.birthdayCard.heading + config.name`), `date`, fires confetti on reveal.

**Props to BirthdayCard**: `heading`, `date`, `isVisible`

**Visuals:**
- Date top center
- Heading with shimmer text effect (diagonal gradient sweep via CSS `background-clip: text`, `background-position` animation, 1.5s, fires once)
- CakeSVG: 2-tier cake, wavy frosting, drip details, 3 striped candles with layered flicker flames
- TulipBouquet (×2, flanking cake): paper cone, 3-4 tulip heads, stems, ribbon
- Confetti burst: 40 particles from center-top on reveal (container handles via useParticles)
- Floating mini hearts: 4-5 tiny hearts with subtle translateY bob animation

---

### 3. LOVE LETTER (LoveLetterSection → LoveLetter)

**Container**: passes `greeting`, `paragraphs`, `date`, triggers typewriter on reveal.

**Props to LoveLetter**: `greeting`, `paragraphs`, `date`, `typedText`, `cursorVisible`, `isVisible`

**Container uses `useTypewriter`** — concatenates greeting + paragraphs, passes resulting `displayText` down as prop.

**Component renders:**
- Left-aligned text mimicking handwritten letter
- Date top-right (always visible, not typewritten)
- Greeting in Dancing Script
- Paragraphs in Caveat, line-height 1.8
- Blinking cursor `|` at end of typedText
- Bottom decorative SVGs: small cake doodle (left), balloon cluster (right), 0.2 opacity

---

### 4. FLOWERS (FlowersSection → FlowersCard, RoseBouquet, KissMark)

**Container**: passes `heading`, manages petal rain while visible.

**Props to FlowersCard**: `heading`, `isVisible`

**Visuals:**
- Heading in Dancing Script
- RoseBouquet SVG (~180px wide): 6-8 roses with spiral/arc petal patterns (varying red shades), green leaves with veins, curved stems bundled, kraft paper cone wrap, ribbon bow
- Bouquet entrance: scale(0.3→1) rotate(-10deg→0) with spring overshoot easing, 800ms
- KissMark SVG (bottom-right, tilted -15deg): lip print shape, red 0.7 opacity
- Falling petals: spawned every 300ms while visible (container manages via useParticles with type 'petals', confined to card bounds via overflow hidden)

---

### 5. MAKE A WISH (MakeAWishSection → WishCard, CakeSVG, BalloonCluster)

**Container**: manages `hasBlown` state, `onBlow` handler, firework sequence, candle relight timer.

**Props to WishCard**: `heading`, `subtext`, `blowButtonLabel`, `blownMessage`, `hasBlown`, `onBlow`, `isVisible`

**Interactive sequence (managed in container):**
1. Button visible: pulsing "blowButtonLabel"
2. On click (`onBlow`):
   - Set hasBlown=true → component animates flame out (CSS: scaleY 1→0.1, opacity 1→0, 400ms)
   - Component shows smoke wisps (3-4 gray circles rising from candle tip)
   - Container emits 3 firework bursts via useParticles (staggered 0ms/200ms/400ms, different colors, 360° spread)
   - Container triggers screen flash (white overlay, opacity 0→0.15→0, 300ms)
   - Button text switches to `blownMessage`
3. After 3s: container sets hasBlown=false → flame relights (fade in 600ms)

**Visuals:**
- Single-tier round cake on pedestal, frosting swirls, one candle with multi-layered flame (outer glow + inner core, CSS flicker)
- BalloonCluster (left side): 3 balloons with strings, gentle bob animation
- Gift box SVG (right side)

---

### 6. FILM STRIP (FilmStripSection → FilmStrip, FilmCanister)

**Container**: passes `heading`, `photos`, `emptyHint`

**Props to FilmStrip**: `heading`, `photos[]`, `emptyHint`, `placeholderText`, `isVisible`

**Layout:**
- Horizontal scrollable strip (overflow-x auto, hidden scrollbar)
- FilmCanister SVG left end (cylinder + reel)
- Photo frames: dark bordered rectangles with sprocket hole strips top/bottom
  - If photo.src exists: `<img>` with object-fit cover, desaturated on load, full color on hover
  - If empty: gray bg, camera icon SVG, `placeholderText`
  - Frame size: clamp(100px, 18vw, 130px) wide, 4:3 ratio
- Strip entrance: slides in from right, frames stagger with 100ms delay, "developing" brightness effect
- Below: `emptyHint` text shown only if any photo is empty

---

### 7. PHOTO GALLERY (PhotoGallerySection → PhotoGallery) — CONDITIONAL

**Container**: reads `config.photos.items`, filters to only those with non-empty `src`. If filtered array is empty → render nothing (return null). Also checks `config.sections` for enabled flag.

**Props to PhotoGallery**: `heading`, `photos[]` (only non-empty ones)

**Polaroid grid:**
- Each photo as polaroid: white frame (8px top/left/right, 32px bottom), sharp corners, shadow
- Random rotation (-6 to +6deg) assigned via JS
- Hover: rotate(0) scale(1.1) z-index 10, deeper shadow, spring easing (cubic-bezier 0.34, 1.56, 0.64, 1)
- CSS grid: `repeat(auto-fit, minmax(160px, 1fr))`, gap 24px
- Entrance: polaroids fly in from alternating left/right (odd/even), staggered 150ms, with rotation overshoot on landing
- After all land: sparkle burst from center (container triggers)

---

### 8. LOVE JAR (LoveJarSection → LoveJar, MasonJar)

**Container**: passes `heading`, `reasons[]`, manages staggered note reveal timing.

**Props to LoveJar**: `heading`, `reasons[]`, `isVisible`, `visibleNoteCount` (container increments this on a timer after reveal)

**MasonJar SVG (~130x160px):**
- Jar body: rounded rect stroke, slight blue tint fill at 0.05 opacity
- Glass highlights: diagonal white strokes, 0.3 opacity
- Lid with ridge lines, heart charm hanging from it
- Pink paper slips visible inside at various angles
- Shine sweep animation (CSS): diagonal white gradient sweeps left-to-right once on reveal

**Love notes:**
- Each reason → pink card, slight rotation (alternating ±2deg), folded corner pseudo-element
- Container increments `visibleNoteCount` every 600ms after reveal
- Component renders notes up to `visibleNoteCount`, each with CSS transition (translateX 60px→0, opacity 0→1, blur 2px→0, 600ms)
- After last note: container emits heart particles rising from jar area

**Mobile:** jar stacks on top, notes below

---

### 9. COUPON (CouponSection → Coupon, StickFigureCouple)

**Container**: passes all coupon config fields.

**Props to Coupon**: `title`, `forLine`, `usesLabel`, `usesValue`, `expiryLabel`, `expiryValue`, `stampText`, `isVisible`

**Coupon styling:**
- Outer card: cardColor
- Inner coupon: cardPinkColor, 3px dashed textRed border, border-radius 14px
- Ticket notches: two pseudo-element circles on left/right edges (cardColor colored, creating cutout illusion)
- StickFigureCouple SVG: top-left and top-right corners (circle head, line body/arms, hearts)
- Title: Patrick Hand, large, textRed, letter-spacing 3px
- For line: Dancing Script, wavy SVG underline (not CSS border)
- Details: Caveat
- Barcode: JS-generated 45 vertical bars (random height/width/gaps)
- Stamp: circular SVG with `<textPath>`, "stampText" curving around circle, rotated -15deg, 0.35 opacity
- Entrance: coupon slides up with slight rotation, stamp slams down with spring easing (scale 0→1, 400ms delay)

---

### 10. CLAW MACHINE (ClawMachineSection → ClawMachine, ClawArm, HeartShape)

**Container**: passes `intro`, `subtitle`, `gemText`, `traits[]`

**Props to ClawMachine**: `intro`, `subtitle`, `gemText`, `traits[]`, `isVisible`

**Claw illustration (~200px wide SVG/CSS hybrid):**
- Top rail bar
- ClawArm: vertical dark rect + V-shaped prongs + pivot circle
- HeartShape: CSS clip-path heart, accentRed fill, gemText in white Patrick Hand
- Swing animation: transform-origin top center, rotate ±4deg, 3.5s infinite ease-in-out
- Sparkle aura: 5-6 small 4-pointed star SVGs positioned around heart, twinkling (CSS scale/opacity pulse, staggered delays)

**Trait badges:**
- Rounded pills, soft red-pink bg, white text, Caveat
- Each has a thin diagonal strikethrough line (pseudo-element, rotated 15deg)
- Entrance: badges slide in from below (staggered 100ms), then strikethrough lines draw in left-to-right (width 0→100%, staggered 200ms)

---

### 11. QR CODE (QRCodeSection → QRCard)

**Container**: passes `heading`, `subtext`, `url`, `fallbackText`, `creditConfig`

**Props to QRCard**: `heading`, `subtext`, `qrUrl`, `fallbackText`, `credit`, `isVisible`

**Content:**
- Heading in Dancing Script
- QR code: `qrcode.react` `<QRCodeSVG>` component, rendered into white rounded container with shadow
- If `qrUrl` is empty: show `fallbackText` instead of QR
- Below: `subtext` in Caveat
- Decorative SVGs: PartyPopper (one side), BalloonCluster (other side), BuntingBanner across top of card
- Continuous gentle confetti rain while visible (container manages, slow particles falling from card top)
- Credit line below card (outside card bounds): if credit.show, render text/link at 12px, 0.35 opacity

---

## GLOBAL UI COMPONENTS

### ProgressBar (rendered in App.jsx)
- Fixed top, full width, 3px height, z-index 9999
- Background: `linear-gradient(90deg, var(--gold-light), var(--accent-red), var(--gold-light))`
- Width driven by `useScrollProgress().progress * 100%`
- `transition: width 0.1s linear`

### SectionDots (rendered in App.jsx)
- Fixed right, vertically centered, z-index 100
- One dot per enabled section
- Active: 10px, gold gradient fill, glow shadow
- Inactive: 7px, white 1.5px border, transparent fill
- Click → smooth scroll to section
- Active state from `useScrollProgress().activeSection`
- Hidden on mobile (≤600px)

### MusicPlayer (rendered in App.jsx, conditionally)
- Only if `config.music.src` is non-empty
- Fixed bottom-right (24px offset), 48px circle
- Glass-morphism: rgba(255,255,255,0.12) bg, backdrop-filter blur(12px), subtle border
- Playing icon: 3 equalizer bars with height animation
- Paused icon: musical note SVG
- Pulse ring when playing: pseudo-element scaling 1→1.6 with fade, 2s infinite
- aria-label from config.music.playLabel / pauseLabel

### FloatingHearts (rendered via useFloatingHearts in App.jsx)
- Fixed container, full viewport, pointer-events none, z-index 0
- Hearts spawn every 1s, random position/size/speed/color
- Float bottom→top with sinusoidal X drift, 10-16s duration
- Max 15 concurrent, auto-remove on animation end

---

## RESPONSIVE

**Breakpoints (in CSS, not JS):**
- `>768px`: full layout, side-by-side jar, dot nav visible
- `601-768px`: reduced padding, 2-col photo grid
- `≤600px`: 94vw cards, stacked layouts, film strip scrollable, dots hidden, seal 72px

**Fluid type:** all via `clamp()` — headings: `clamp(24px, 5vw, 40px)`, body: `clamp(16px, 3vw, 22px)`, sub: `clamp(12px, 2.5vw, 16px)`

**Touch:** 44px min tap targets, film strip `-webkit-overflow-scrolling: touch`, hidden scrollbar

---

## ACCESSIBILITY

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
- JS: check `matchMedia('(prefers-reduced-motion: reduce)')` → disable particle system, skip typewriter, show all cards visible immediately, no floating hearts
- Semantic: `<section aria-label>`, `<button>` for interactives, decorative SVGs get `aria-hidden="true"`
- Alt text on photos from `config.photos.items[].alt`

---

## BUILD & DEPLOY

```bash
npm create vite@latest birthday-greeting -- --template react
cd birthday-greeting
npm install qrcode.react
# Build
npm run build  # outputs to dist/
# Deploy dist/ to any static host
```

---

## VERIFICATION CHECKLIST

After building, verify ALL of these:

### Data isolation
1. `grep -r` any content string ("Happy Birthday", "Dear love", "tap to open", etc.) across `src/components/` and `src/containers/` — ZERO matches. All such strings exist only in `data/config.js`.
2. Change `config.name` → every instance on the page updates.
3. Change `config.theme.bgColor` → background updates. Change `config.theme.cardColor` → all cards update.
4. Change `config.loveJar.reasons` to 3 items → works. To 8 items → works.
5. Set `config.music.src = ""` → music button disappears entirely.
6. Set `config.credit.show = false` → no credit visible.
7. Set all `config.photos.items[].src = ""` → photo gallery section doesn't render. Film strip shows placeholders.
8. Set `config.qr.url = ""` → shows fallback text, no broken QR.
9. Set `config.sections[3].enabled = false` → flowers section is skipped, dot nav adjusts.

### Animations
10. Envelope seal has idle pulse, cracks with sparkles on click, flap opens smoothly.
11. Cards enter with blur-clear + translateY + scale + rotateX animation.
12. Children inside cards stagger in after card arrives.
13. Confetti fires on birthday card reveal.
14. Typewriter effect types letter naturally with pauses.
15. Petals fall on flowers section.
16. Candle blow-out → smoke → fireworks → screen flash → relight works.
17. Film strip slides in from right with develop effect.
18. Polaroids fly in from alternating sides.
19. Love notes stagger in 600ms apart, heart burst after last note.
20. Coupon stamp slams in with spring easing.
21. Claw heart swings with sparkle aura, traits get crossed out sequentially.
22. Floating hearts continuously rise in background.
23. Progress bar and dot nav track scroll accurately.

### Responsive + a11y
24. Mobile 375px — everything fits, tappable, scrollable.
25. `prefers-reduced-motion` — all animations off, full content visible.
26. No hardcoded colors in CSS (all via custom properties).