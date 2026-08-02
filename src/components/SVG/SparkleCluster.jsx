// Four-pointed sparkle doodles, drawn as concave diamonds like the reference.
const SPARKS = [
  { x: 22, y: 24, r: 15 },
  { x: 62, y: 12, r: 21 },
  { x: 52, y: 52, r: 13 },
  { x: 86, y: 46, r: 9 },
  { x: 16, y: 62, r: 8 },
];

function sparkPath(x, y, r) {
  const w = r * 0.3;
  return (
    `M ${x} ${y - r}` +
    ` Q ${x + w} ${y - w} ${x + r} ${y}` +
    ` Q ${x + w} ${y + w} ${x} ${y + r}` +
    ` Q ${x - w} ${y + w} ${x - r} ${y}` +
    ` Q ${x - w} ${y - w} ${x} ${y - r} Z`
  );
}

export function SparkleCluster({ color = 'var(--ink-red)', className = '' }) {
  return (
    <svg
      className={`sparkle-cluster ${className}`}
      viewBox="0 0 104 80"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {SPARKS.map((s, i) => (
        <path
          key={s.x + '-' + s.y}
          d={sparkPath(s.x, s.y, s.r)}
          stroke={color}
          strokeWidth="2.4"
          strokeLinejoin="round"
          style={{ animationDelay: `${i * 220}ms` }}
          className="sparkle-cluster__spark"
        />
      ))}
    </svg>
  );
}
