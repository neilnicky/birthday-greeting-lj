// Line-art tiered cake with drip frosting and lit candles. Outline only, in
// the same pen weight as the rest of the card doodles.
export function CakeSVG({
  color = 'var(--ink-red)',
  candles = 5,
  lit = true,
  flameOuter = '#f6a623',
  flameInner = '#ffe27a',
  className = '',
}) {
  const span = 108;
  const left = 46;
  const xs =
    candles <= 1
      ? [100]
      : Array.from({ length: candles }, (_, i) => left + (span / (candles - 1)) * i);

  return (
    <svg
      className={`svg-cake ${className}`}
      viewBox="0 0 200 180"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Candles */}
      <g stroke={color} strokeWidth="2.6" strokeLinecap="round">
        {xs.map((x) => (
          <path key={x} d={`M${x} 44 V72`} />
        ))}
      </g>
      {lit
        ? xs.map((x, i) => (
            <g key={`f-${x}`} className="flame" style={{ animationDelay: `${i * 90}ms` }}>
              <path
                d={`M${x + 5} 32 C${x + 5} 25 ${x} 22 ${x} 15 C${x} 22 ${x - 5} 25 ${x - 5} 32 C${x - 5} 38 ${x - 2} 41 ${x} 41 C${x + 2} 41 ${x + 5} 38 ${x + 5} 32 Z`}
                fill={flameOuter}
              />
              <path
                d={`M${x + 2.4} 33 C${x + 2.4} 29 ${x} 27.5 ${x} 24 C${x} 27.5 ${x - 2.4} 29 ${x - 2.4} 33 C${x - 2.4} 36 ${x - 1} 37.5 ${x} 37.5 C${x + 1} 37.5 ${x + 2.4} 36 ${x + 2.4} 33 Z`}
                fill={flameInner}
              />
            </g>
          ))
        : null}

      <g stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Top tier + drips */}
        <path d="M62 74 H138 V104 H62 Z" />
        <path d="M62 74 c8 8 14 8 20 1 c7 8 13 8 20 0 c7 8 13 8 20 0 c6 7 12 7 16 -1" />

        {/* Bottom tier + drips */}
        <path d="M36 106 H164 V150 H36 Z" />
        <path d="M36 106 c9 9 16 9 22 1 c8 9 15 9 22 0 c8 9 15 9 22 0 c8 9 15 9 22 0 c8 9 15 9 22 0 c6 6 11 6 16 -1" />

        {/* Stand */}
        <path d="M94 150 v10" />
        <path d="M106 150 v10" />
        <ellipse cx="100" cy="164" rx="76" ry="9" />
        <path d="M24 164 c8 10 30 14 76 14 s68 -4 76 -14" />
      </g>
    </svg>
  );
}
