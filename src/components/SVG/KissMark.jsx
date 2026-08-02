// Lipstick print: solid lips broken up by lighter creases so it reads as a
// blotted kiss rather than a flat shape.
export function KissMark({ color = '#c8121f', crease = '#f0616c', className = '' }) {
  return (
    <svg
      className={`svg-kiss ${className}`}
      viewBox="0 0 140 96"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g fill={color}>
        {/* Upper lip */}
        <path d="M70 40 C64 22 52 12 38 14 C20 16 8 30 6 42 C24 40 48 38 70 40 Z" />
        <path d="M70 40 C76 22 88 12 102 14 C120 16 132 30 134 42 C116 40 92 38 70 40 Z" />
        {/* Lower lip */}
        <path d="M6 46 C22 44 48 42 70 44 C92 42 118 44 134 46 C126 68 102 88 70 90 C38 88 14 68 6 46 Z" />
      </g>

      {/* Creases */}
      <g stroke={crease} strokeWidth="2" strokeLinecap="round" opacity="0.85">
        <path d="M26 30 L22 44" />
        <path d="M42 22 L40 42" />
        <path d="M58 22 L58 41" />
        <path d="M82 22 L82 41" />
        <path d="M98 22 L100 42" />
        <path d="M114 30 L118 44" />
        <path d="M22 52 L28 66" />
        <path d="M42 54 L44 74" />
        <path d="M60 55 L60 80" />
        <path d="M80 55 L80 80" />
        <path d="M98 54 L96 74" />
        <path d="M118 52 L112 66" />
      </g>
    </svg>
  );
}
