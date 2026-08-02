// The hero bouquet: a dense dome of spiral red roses in a pale wrapper with a
// ribbon. Rose positions are fixed so the arrangement is stable across renders.
const ROSES = [
  { x: 100, y: 46, r: 17, shade: 0 },
  { x: 66, y: 58, r: 16, shade: 1 },
  { x: 134, y: 58, r: 16, shade: 1 },
  { x: 84, y: 82, r: 17, shade: 0 },
  { x: 118, y: 82, r: 17, shade: 2 },
  { x: 48, y: 88, r: 15, shade: 2 },
  { x: 152, y: 88, r: 15, shade: 0 },
  { x: 66, y: 112, r: 15, shade: 1 },
  { x: 100, y: 110, r: 16, shade: 2 },
  { x: 134, y: 112, r: 15, shade: 1 },
  { x: 84, y: 136, r: 13, shade: 0 },
  { x: 118, y: 136, r: 13, shade: 2 },
];

function spiral(cx, cy, r) {
  let d = `M ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  const turns = 2.4;
  const steps = 34;
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    const rad = r * 0.92 * t;
    d += ` L ${(cx + Math.cos(a) * rad).toFixed(1)} ${(cy + Math.sin(a) * rad * 0.94).toFixed(1)}`;
  }
  return d;
}

export function RoseBouquet({
  petals = ['#e02434', '#c4101f', '#f0424f'],
  outline = '#8e0d18',
  wrap = '#dfe6f5',
  wrapLine = 'var(--ink-red)',
  className = '',
}) {
  return (
    <svg
      className={`svg-roses ${className}`}
      viewBox="0 0 200 280"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Wrapper behind the flowers */}
      <path
        d="M28 108 L100 76 L172 108 L150 210 L100 234 L50 210 Z"
        fill={wrap}
        stroke={wrapLine}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Roses */}
      {ROSES.map((rose) => (
        <g key={`${rose.x}-${rose.y}`}>
          <circle cx={rose.x} cy={rose.y} r={rose.r} fill={petals[rose.shade]} />
          <path
            d={spiral(rose.x, rose.y, rose.r)}
            stroke={outline}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
        </g>
      ))}

      {/* Wrapper front folds + ribbon */}
      <g stroke={wrapLine} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M60 150 L100 234 L140 150" fill={wrap} fillOpacity="0.85" />
        <path d="M100 234 L100 276" />
        <path d="M78 196 C88 190 112 190 122 196" />
        <path d="M100 196 C86 186 68 190 71 202 C74 214 94 208 100 199" />
        <path d="M100 196 C114 186 132 190 129 202 C126 214 106 208 100 199" />
        <path d="M96 206 C88 232 84 254 82 274" />
        <path d="M104 206 C112 232 116 254 118 274" />
      </g>
    </svg>
  );
}
