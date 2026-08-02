// Outlined balloon trio on curling strings tied with a bow. Sized by CSS so it
// scales with the stage; `bob` drives the idle sway.
const BALLOONS = [
  { cx: 44, cy: 52, rx: 30, ry: 37, rot: -10, delay: '0s' },
  { cx: 104, cy: 40, rx: 30, ry: 38, rot: 8, delay: '0.5s' },
  { cx: 76, cy: 96, rx: 27, ry: 34, rot: -2, delay: '1s' },
];

export function BalloonCluster({ color = 'var(--ink-red)', bob = true, className = '' }) {
  return (
    <svg
      className={`svg-balloons ${className}`}
      viewBox="0 0 160 230"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        {BALLOONS.map((b) => (
          <g
            key={`${b.cx}-${b.cy}`}
            className={bob ? 'svg-balloons__balloon' : undefined}
            style={bob ? { animationDelay: b.delay } : undefined}
            transform={`rotate(${b.rot} ${b.cx} ${b.cy})`}
          >
            <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} />
            {/* Knot */}
            <path d={`M${b.cx - 5} ${b.cy + b.ry} l5 6 l5 -6`} />
            {/* Gloss */}
            <path d={`M${b.cx - b.rx * 0.5} ${b.cy - b.ry * 0.35} q4 -14 16 -18`} opacity="0.6" />
          </g>
        ))}

        {/* Strings gathered into a bow */}
        <path d="M44 95 C48 130 62 152 76 172" />
        <path d="M104 82 C102 122 88 150 76 172" />
        <path d="M76 132 C74 150 75 162 76 172" />
        <path d="M76 172 C62 164 50 168 52 178 C54 187 70 184 76 174" />
        <path d="M76 172 C90 164 102 168 100 178 C98 187 82 184 76 174" />
        <path d="M76 176 C72 192 66 202 58 210" />
        <path d="M76 176 C80 192 86 202 94 210" />
      </g>
    </svg>
  );
}
