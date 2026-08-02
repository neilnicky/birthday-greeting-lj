// Layered slice of cake on a plate with one lit candle. The flame is a
// separate node so `lit` can extinguish it and hand over to the smoke wisps.
export function CakeSlice({
  color = 'var(--ink-navy)',
  flameOuter = '#f6a623',
  flameInner = '#ffe27a',
  lit = true,
  className = '',
}) {
  return (
    <svg
      className={`cake-slice ${className}`}
      viewBox="0 0 180 190"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Candle + flame */}
      <g>
        {lit ? (
          <g className="flame">
            <path
              d="M108 34 C108 24 100 20 100 10 C100 20 92 24 92 34 C92 42 96 46 100 46 C104 46 108 42 108 34 Z"
              fill={flameOuter}
            />
            <path
              d="M104 36 C104 30 100 28 100 22 C100 28 96 30 96 36 C96 41 98 43 100 43 C102 43 104 41 104 36 Z"
              fill={flameInner}
            />
          </g>
        ) : null}
        <path d="M100 48 V78" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
      </g>

      <g stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Cream swirls on top */}
        <path d="M60 92 c0-10 10-16 18-12 4-9 16-9 20-1 8-4 16 2 15 11" />
        <circle cx="126" cy="86" r="7" />
        <path d="M120 78 v-8" />

        {/* Slice body: front face + cut side */}
        <path d="M44 96 H150 L138 150 H56 Z" />
        <path d="M44 112 H150" />
        <path d="M48 130 H146" />

        {/* Plate */}
        <ellipse cx="97" cy="158" rx="66" ry="11" />
        <path d="M31 158 c6 12 22 18 66 18 s60-6 66-18" />
      </g>
    </svg>
  );
}
