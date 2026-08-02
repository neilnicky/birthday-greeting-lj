// Tulips in a paper cone — the pair flanking the birthday card. Soft blush
// heads with a line-art wrapper, matching the reference's watercolour clip-art.
const TULIPS = [
  { x: 46, y: 40, rot: -14 },
  { x: 78, y: 28, rot: 2 },
  { x: 108, y: 44, rot: 14 },
  { x: 62, y: 62, rot: -6 },
  { x: 94, y: 66, rot: 8 },
];

function Head({ x, y, rot, petal, outline }) {
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <path
        d={`M${x - 16} ${y - 2} C${x - 16} ${y - 22} ${x - 6} ${y - 30} ${x} ${y - 30} C${x + 6} ${y - 30} ${x + 16} ${y - 22} ${x + 16} ${y - 2} C${x + 16} ${y + 12} ${x + 8} ${y + 18} ${x} ${y + 18} C${x - 8} ${y + 18} ${x - 16} ${y + 12} ${x - 16} ${y - 2} Z`}
        fill={petal}
        stroke={outline}
        strokeWidth="2"
      />
      <path
        d={`M${x - 6} ${y - 26} C${x - 9} ${y - 10} ${x - 8} ${y + 4} ${x - 4} ${y + 16}`}
        stroke={outline}
        strokeWidth="1.6"
        fill="none"
        opacity="0.7"
      />
      <path
        d={`M${x + 6} ${y - 26} C${x + 9} ${y - 10} ${x + 8} ${y + 4} ${x + 4} ${y + 16}`}
        stroke={outline}
        strokeWidth="1.6"
        fill="none"
        opacity="0.7"
      />
    </g>
  );
}

export function TulipBouquet({
  petal = '#e9a7c0',
  outline = 'var(--ink-red)',
  stem = '#7fa88a',
  flip = false,
  className = '',
}) {
  return (
    <svg
      className={`svg-tulips ${className}`}
      viewBox="0 0 160 220"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      {/* Stems + leaves */}
      <g stroke={stem} strokeWidth="2.6" strokeLinecap="round" fill="none">
        <path d="M46 52 C52 96 66 128 78 150" />
        <path d="M78 40 C78 90 78 124 80 150" />
        <path d="M108 56 C104 98 90 128 82 150" />
        <path d="M62 74 C66 108 74 132 80 150" />
        <path d="M94 78 C90 110 84 132 80 150" />
        <path d="M56 96 C38 92 28 102 30 118 C44 118 54 110 58 100" fill="none" />
        <path d="M104 106 C124 102 134 114 130 128 C116 126 108 118 104 108" fill="none" />
      </g>

      {TULIPS.map((t) => (
        <Head key={`${t.x}-${t.y}`} {...t} petal={petal} outline={outline} />
      ))}

      {/* Paper cone + ribbon */}
      <g stroke={outline} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M38 132 L80 214 L124 132 L102 148 L80 138 L58 148 Z" fill="#ffffff" fillOpacity="0.55" />
        <path d="M62 150 L80 200" opacity="0.5" />
        <path d="M100 150 L82 200" opacity="0.5" />
        <path d="M64 176 C72 172 90 172 98 176" />
        <path d="M80 176 C70 168 58 170 60 180 C62 188 76 184 80 178" />
        <path d="M80 176 C90 168 102 170 100 180 C98 188 84 184 80 178" />
      </g>
    </svg>
  );
}
