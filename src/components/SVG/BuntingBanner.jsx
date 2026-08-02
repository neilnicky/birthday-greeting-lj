// Outlined bunting on a draped string, hatched like a pen sketch. `sway`
// drives the idle rock.
export function BuntingBanner({ color = 'var(--ink-red)', flags = 5, sway = true, className = '' }) {
  const width = 300;
  const step = width / (flags + 1);
  const droop = 34;
  const yAt = (i) => 26 + Math.sin((i / (flags + 1)) * Math.PI) * droop;

  return (
    <svg
      className={`svg-bunting ${sway ? 'is-swaying' : ''} ${className}`}
      viewBox="0 0 300 130"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        {/* String, with a curl at each end */}
        <path d={`M6 22 C${width * 0.3} ${26 + droop * 1.15} ${width * 0.7} ${26 + droop * 1.15} 294 22`} />
        <path d="M6 22 C-2 14 4 4 14 8 C22 11 20 22 10 24" />
        <path d="M294 22 C302 14 296 4 286 8 C278 11 280 22 290 24" />

        {/* Flags */}
        {Array.from({ length: flags }, (_, i) => {
          const x = step * (i + 1);
          const y = yAt(i + 1);
          const w = 24;
          const h = 40;
          return (
            <g key={x}>
              <path d={`M${x - w} ${y} L${x + w} ${y} L${x} ${y + h} Z`} />
              <path d={`M${x - w * 0.5} ${y + 6} L${x - 2} ${y + h - 8}`} opacity="0.5" />
              <path d={`M${x + w * 0.5} ${y + 6} L${x + 2} ${y + h - 8}`} opacity="0.5" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
