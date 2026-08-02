// Award-rosette doodle: scalloped medal with a star centre and two ribbon tails.
const POINTS = 14;

function scallop(cx, cy, r, bumps) {
  let d = '';
  for (let i = 0; i < bumps; i += 1) {
    const a0 = (i / bumps) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / bumps) * Math.PI * 2 - Math.PI / 2;
    const am = (a0 + a1) / 2;
    const x0 = cx + Math.cos(a0) * r;
    const y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const xm = cx + Math.cos(am) * r * 1.28;
    const ym = cy + Math.sin(am) * r * 1.28;
    d += i === 0 ? `M ${x0.toFixed(1)} ${y0.toFixed(1)}` : '';
    d += ` Q ${xm.toFixed(1)} ${ym.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return `${d} Z`;
}

function star(cx, cy, outer, inner) {
  let d = '';
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} Z`;
}

export function RosetteBadge({ color = 'var(--ink-red)', className = '' }) {
  return (
    <svg
      className={`rosette ${className}`}
      viewBox="0 0 88 124"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {/* Ribbon tails */}
        <path d="M30 68 L20 116 L36 106 L46 120 L54 70" />
        {/* Rosette */}
        <path d={scallop(44, 44, 26, POINTS)} />
        <circle cx="44" cy="44" r="19" />
        <path d={star(44, 44, 12, 5.4)} />
      </g>
    </svg>
  );
}
