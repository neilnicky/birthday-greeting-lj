// Pair of overlapping outlined hearts, drawn with the doubled contour of a
// pen going round twice — the doodle in the claw card's top-right corner.
const HEART =
  'M52 96 C52 96 8 66 8 36 C8 18 22 8 34 12 C43 15 50 24 52 32 C54 24 61 15 70 12 C82 8 96 18 96 36 C96 66 52 96 52 96 Z';

export function HeartDoodles({ color = 'var(--ink-red)', className = '' }) {
  return (
    <svg
      className={`heart-doodles ${className}`}
      viewBox="0 0 190 130"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(78 4) scale(0.92)">
          <path d={HEART} />
        </g>
        <g transform="translate(6 26)">
          <path d={HEART} />
          <path d={HEART} transform="translate(9 7) scale(0.82)" opacity="0.85" />
        </g>
      </g>
    </svg>
  );
}
