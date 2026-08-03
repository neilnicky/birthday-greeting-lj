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

// Loose spiral for the rose centre. Kept to under two turns so it reads as
// furled petals rather than a lollipop.
function spiral(cx, cy, r) {
  let d = `M ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  const turns = 1.55;
  const steps = 28;
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2 + 0.8;
    const rad = r * 0.6 * t;
    d += ` L ${(cx + Math.cos(a) * rad).toFixed(1)} ${(cy + Math.sin(a) * rad * 0.94).toFixed(1)}`;
  }
  return d;
}

// Outer petals wrapping the spiral.
function petals(cx, cy, r) {
  const arc = (a0, a1) => {
    const x0 = cx + Math.cos(a0) * r * 0.82;
    const y0 = cy + Math.sin(a0) * r * 0.82;
    const x1 = cx + Math.cos(a1) * r * 0.82;
    const y1 = cy + Math.sin(a1) * r * 0.82;
    return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${(r * 0.9).toFixed(1)} ${(r * 0.9).toFixed(1)} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  return [arc(0.4, 2.4), arc(2.6, 4.6), arc(4.8, 6.5)].join(' ');
}

export function RoseBouquet({
  petalColors = ['#e02434', '#c4101f', '#f0424f'],
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
          <circle cx={rose.x} cy={rose.y} r={rose.r} fill={petalColors[rose.shade]} />
          <path
            d={petals(rose.x, rose.y, rose.r)}
            stroke={outline}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d={spiral(rose.x, rose.y, rose.r)}
            stroke={outline}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
        </g>
      ))}

      {/* Wrapper front fold + ribbon */}
      <g stroke={wrapLine} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M52 138 L100 236 L148 138" fill={wrap} />
        <path d="M100 236 L100 272" />
        <path d="M100 198 C86 188 68 192 71 204 C74 216 94 210 100 201" />
        <path d="M100 198 C114 188 132 192 129 204 C126 216 106 210 100 201" />
        <path d="M96 208 C90 232 86 252 84 270" />
        <path d="M104 208 C110 232 114 252 116 270" />
      </g>
    </svg>
  );
}
