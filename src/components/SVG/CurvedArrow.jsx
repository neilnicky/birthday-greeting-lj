// Sweeping hand-drawn arrow. `drawn` runs the stroke-dash reveal so it looks
// like it is being drawn in.
export function CurvedArrow({ color = 'var(--ink-red)', drawn = true, className = '' }) {
  return (
    <svg
      className={`curved-arrow ${drawn ? 'is-drawn' : ''} ${className}`}
      viewBox="0 0 140 160"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke={color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <path className="curved-arrow__shaft" pathLength="1" d="M124 14 C132 66 106 116 44 140" />
        <path className="curved-arrow__head" pathLength="1" d="M64 138 L42 141 L50 120" />
      </g>
    </svg>
  );
}
