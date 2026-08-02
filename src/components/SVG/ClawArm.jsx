// Arcade claw: cable, stopper block, pivot ball and two angular prongs.
// `grip` closes the prongs around whatever the card puts underneath.
export function ClawArm({ color = 'var(--ink-black)', grip = false, className = '' }) {
  const spread = grip ? 0 : 1;
  return (
    <svg
      className={`svg-claw ${grip ? 'is-gripping' : ''} ${className}`}
      viewBox="0 0 160 220"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Cable */}
      <rect x="70" y="0" width="20" height="112" fill={color} />
      {/* Stopper */}
      <rect x="52" y="112" width="56" height="18" rx="3" fill={color} />
      {/* Pivot */}
      <circle cx="80" cy="146" r="15" fill={color} />

      <g
        stroke={color}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="svg-claw__prongs"
      >
        <path d={`M80 150 L${40 + spread * -8} ${176 + spread * -4} L${44 + spread * -14} ${210 + spread * 2}`} />
        <path d={`M80 150 L${120 + spread * 8} ${176 + spread * -4} L${116 + spread * 14} ${210 + spread * 2}`} />
      </g>
    </svg>
  );
}
