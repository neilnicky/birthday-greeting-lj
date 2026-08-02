// 35mm film canister — pale body between two dark caps, with the spool stub on
// top. The strip that pulls out of it is drawn by the card, not here.
export function FilmCanister({
  body = '#e8f4fb',
  cap = '#1c1c1c',
  outline = '#1c1c1c',
  className = '',
}) {
  return (
    <svg
      className={`svg-canister ${className}`}
      viewBox="0 0 120 190"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Spool stub */}
      <rect x="44" y="4" width="32" height="20" rx="4" fill={cap} />

      {/* Caps */}
      <rect x="14" y="22" width="92" height="22" rx="7" fill={cap} />
      <rect x="14" y="150" width="92" height="24" rx="7" fill={cap} />

      {/* Body */}
      <rect x="18" y="40" width="84" height="114" fill={body} stroke={outline} strokeWidth="2" />

      {/* Cylindrical shading */}
      <rect x="18" y="40" width="14" height="114" fill="#000" opacity="0.1" />
      <rect x="88" y="40" width="14" height="114" fill="#000" opacity="0.14" />
      <rect x="44" y="40" width="10" height="114" fill="#fff" opacity="0.6" />
    </svg>
  );
}
