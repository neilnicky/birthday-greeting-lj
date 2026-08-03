// Lipstick print: an upper lip with two peaks and a centre dip, a fuller lower
// lip, and lighter creases so it reads as blotted lipstick, not a flat shape.
export function KissMark({ color = '#c8121f', crease = '#f0616c', className = '' }) {
  return (
    <svg
      className={`svg-kiss ${className}`}
      viewBox="0 0 160 104"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g fill={color}>
        {/* Upper lip */}
        <path d="M8 48 C22 18 46 6 58 22 C64 30 72 34 80 34 C88 34 96 30 102 22 C114 6 138 18 152 48 C120 40 100 42 80 43 C60 42 40 40 8 48 Z" />
        {/* Lower lip */}
        <path d="M8 52 C40 44 118 44 152 52 C142 82 114 100 80 100 C46 100 18 82 8 52 Z" />
      </g>

      <g stroke={crease} strokeWidth="1.7" strokeLinecap="round" opacity="0.75">
        <path d="M22 34 L18 46" />
        <path d="M40 20 L38 42" />
        <path d="M56 20 L58 42" />
        <path d="M70 28 L71 43" />
        <path d="M90 28 L89 43" />
        <path d="M104 20 L102 42" />
        <path d="M120 20 L122 42" />
        <path d="M138 34 L142 46" />
        <path d="M20 56 L28 70" />
        <path d="M40 58 L44 82" />
        <path d="M60 60 L61 92" />
        <path d="M80 60 L80 96" />
        <path d="M100 60 L99 92" />
        <path d="M120 58 L116 82" />
        <path d="M140 56 L132 70" />
      </g>
    </svg>
  );
}
