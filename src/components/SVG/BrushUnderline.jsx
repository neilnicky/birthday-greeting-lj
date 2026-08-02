// Dry-brush rule under the letter greeting: a solid tapered core with a
// broken, speckled trailing edge. `drawn` wipes it in from the left.
export function BrushUnderline({ color = 'var(--ink-red)', drawn = true, className = '' }) {
  return (
    <svg
      className={`brush-underline ${drawn ? 'is-drawn' : ''} ${className}`}
      viewBox="0 0 600 26"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="brush-underline__core"
        d="M6 15 C90 6 170 20 260 12 C350 4 430 18 520 10 C556 7 578 11 594 9"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        className="brush-underline__dry"
        d="M40 20 C120 13 190 24 280 17 C370 10 450 22 540 15"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeDasharray="3 7 12 5 6 9"
        opacity="0.7"
      />
    </svg>
  );
}
