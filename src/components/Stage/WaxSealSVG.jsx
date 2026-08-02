// Procedural gold wax seal. Pure — colours arrive as props.
// Rendered as poured wax: a scalloped irregular blob, a raised rim, two
// embossed rings and a grainy pressed centre. No raster asset required.

// Deterministic wobble so the shape is identical on every render/reload.
function wobble(i, total) {
  const t = (i / total) * Math.PI * 2;
  return (
    Math.sin(t * 3 + 0.7) * 0.55 +
    Math.sin(t * 5 + 2.1) * 0.3 +
    Math.sin(t * 8 + 4.4) * 0.15
  );
}

// Closed path through N points, smoothed by putting the sample points on the
// control handles and the midpoints on the curve.
function buildBlob(cx, cy, radius, amplitude, lobes) {
  const pts = [];
  for (let i = 0; i < lobes; i += 1) {
    const angle = (i / lobes) * Math.PI * 2 - Math.PI / 2;
    const r = radius + wobble(i, lobes) * amplitude;
    pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
  }

  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const f = (n) => n.toFixed(2);

  let d = '';
  const start = mid(pts[lobes - 1], pts[0]);
  d += `M ${f(start[0])} ${f(start[1])}`;
  for (let i = 0; i < lobes; i += 1) {
    const ctrl = pts[i];
    const end = mid(pts[i], pts[(i + 1) % lobes]);
    d += ` Q ${f(ctrl[0])} ${f(ctrl[1])} ${f(end[0])} ${f(end[1])}`;
  }
  return `${d} Z`;
}

const OUTER_BLOB = buildBlob(50, 50, 43, 4.2, 11);
const RIM_BLOB = buildBlob(50, 50, 36.5, 2.4, 11);

export function WaxSealSVG({
  goldLight = '#f5e2a8',
  gold = '#d9b45c',
  goldDark = '#8f6c1e',
  title,
}) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={title}>
      <defs>
        <radialGradient id="wax-outer" cx="36%" cy="28%" r="78%">
          <stop offset="0%" stopColor={goldLight} />
          <stop offset="42%" stopColor={gold} />
          <stop offset="100%" stopColor={goldDark} />
        </radialGradient>

        <radialGradient id="wax-rim" cx="40%" cy="30%" r="72%">
          <stop offset="0%" stopColor={goldLight} />
          <stop offset="55%" stopColor={gold} />
          <stop offset="100%" stopColor={goldDark} />
        </radialGradient>

        <radialGradient id="wax-core" cx="44%" cy="34%" r="70%">
          <stop offset="0%" stopColor={goldLight} />
          <stop offset="62%" stopColor={gold} />
          <stop offset="100%" stopColor={goldDark} />
        </radialGradient>

        <radialGradient id="wax-gloss" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* Warps the wax edge so it never reads as a vector circle. */}
        <filter id="wax-edge" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="3"
            seed="4"
            result="edgeNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="edgeNoise"
            scale="3.4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Pressed-wax grain across the centre disc. */}
        <filter id="wax-grain" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            numOctaves="4"
            seed="9"
            result="grain"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="grain"
            scale="2.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="wax-shadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow
            dx="0"
            dy="1.6"
            stdDeviation="2.2"
            floodColor="#000000"
            floodOpacity="0.42"
          />
        </filter>
      </defs>

      <g filter="url(#wax-shadow)">
        {/* Splattered outer wax */}
        <path d={OUTER_BLOB} fill="url(#wax-outer)" filter="url(#wax-edge)" />

        {/* Raised rim */}
        <path
          d={RIM_BLOB}
          fill="url(#wax-rim)"
          stroke={goldDark}
          strokeOpacity="0.45"
          strokeWidth="0.8"
        />

        {/* Embossed rings */}
        <circle cx="50" cy="50" r="32" fill="none" stroke={goldDark} strokeOpacity="0.5" strokeWidth="1.1" />
        <circle cx="50" cy="50" r="29.4" fill="none" stroke={goldLight} strokeOpacity="0.45" strokeWidth="0.7" />
        <circle cx="50" cy="50" r="26.5" fill="none" stroke={goldDark} strokeOpacity="0.38" strokeWidth="0.9" />

        {/* Pressed centre */}
        <circle cx="50" cy="50" r="24" fill="url(#wax-core)" filter="url(#wax-grain)" />
        <circle cx="50" cy="50" r="24" fill="none" stroke={goldDark} strokeOpacity="0.3" strokeWidth="0.7" />

        {/* Specular highlight */}
        <ellipse cx="41" cy="34" rx="16" ry="11" fill="url(#wax-gloss)" transform="rotate(-24 41 34)" />
      </g>
    </svg>
  );
}
