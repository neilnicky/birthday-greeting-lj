// Line-art gift box with a big looped bow — the doodle on the right of the
// "make a wish" card.
export function GiftBox({ color = 'var(--ink-red)', className = '' }) {
  return (
    <svg
      className={`gift-box ${className}`}
      viewBox="0 0 150 130"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Box + lid */}
        <path d="M18 52 H132 V118 H18 Z" />
        <path d="M12 34 H138 V52 H12 Z" />
        {/* Ribbon down the front */}
        <path d="M75 34 V118" />
        {/* Bow */}
        <path d="M75 34 C60 34 40 26 42 14 C44 4 62 6 68 16 C72 23 75 30 75 34 Z" />
        <path d="M75 34 C90 34 110 26 108 14 C106 4 88 6 82 16 C78 23 75 30 75 34 Z" />
        <path d="M75 34 C72 26 66 20 58 18" />
        <path d="M75 34 C78 26 84 20 92 18" />
        {/* Feet */}
        <path d="M28 118 V126" />
        <path d="M122 118 V126" />
      </g>
    </svg>
  );
}
