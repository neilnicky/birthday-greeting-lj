// One doodled stick figure holding a little cluster of hearts, as on the
// coupon. `flip` mirrors it for the opposite side of the ticket.
export function StickFigure({
  color = 'var(--ink-navy)',
  heartColor = '#e0242f',
  flip = false,
  className = '',
}) {
  return (
    <svg
      className={`svg-figure ${className}`}
      viewBox="0 0 110 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <g stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Head, slightly egg-shaped like a doodle */}
        <ellipse cx="30" cy="28" rx="22" ry="24" />
        <circle cx="23" cy="24" r="1.8" fill={color} />
        <circle cx="37" cy="24" r="1.8" fill={color} />
        <path d="M27 37 C29 41 33 41 35 37 C33 34 29 34 27 37 Z" />

        {/* Body + limbs */}
        <path d="M30 52 V88" />
        <path d="M30 62 L10 78" />
        <path d="M30 62 L54 50" />
        <path d="M30 88 L16 116" />
        <path d="M30 88 L44 116" />
      </g>

      {/* Hearts floating from the raised hand */}
      <g fill={heartColor}>
        <path d="M62 46 c-4-8 4-14 8-8 4-6 12 0 8 8 -3 6-8 10-8 10 s-5-4-8-10Z" />
        <path d="M84 30 c-3-6 3-11 6-6 3-5 9 0 6 6 -2 5-6 8-6 8 s-4-3-6-8Z" />
        <path d="M80 58 c-2-5 3-9 5-5 2-4 7 0 5 5 -2 4-5 6-5 6 s-3-2-5-6Z" />
      </g>
    </svg>
  );
}
