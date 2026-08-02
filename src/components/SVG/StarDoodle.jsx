// Loose hand-drawn five-point star with a trailing swoosh — the doodle under
// the film strip. Deliberately imperfect: the strokes overshoot at the points.
export function StarDoodle({ color = 'var(--ink-red)', className = '' }) {
  return (
    <svg
      className={`star-doodle ${className}`}
      viewBox="0 0 200 150"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M74 16 L94 68 L150 70 L106 102 L122 152 L74 120 L26 150 L44 100 L4 66 L60 66 Z" />
        <path d="M124 108 C148 118 172 122 196 118" />
      </g>
    </svg>
  );
}
