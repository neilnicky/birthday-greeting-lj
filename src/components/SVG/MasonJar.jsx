// Line-art mason jar with a ridged lid and a heart tag on twine. Notes are
// rendered by the card on top of this, so the jar itself stays empty.
export function MasonJar({ color = 'var(--ink-navy)', className = '' }) {
  return (
    <svg
      className={`svg-jar ${className}`}
      viewBox="0 0 200 260"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Lid */}
        <path d="M44 34 H156 V56 H44 Z" />
        <ellipse cx="100" cy="34" rx="56" ry="11" />
        <path d="M44 44 H156" opacity="0.55" />
        <path d="M44 50 H156" opacity="0.55" />

        {/* Neck ring */}
        <path d="M50 56 H150 V70 H50 Z" />

        {/* Body */}
        <path d="M50 70 C34 82 30 100 30 130 V200 C30 226 44 240 70 242 H130 C156 240 170 226 170 200 V130 C170 100 166 82 150 70" />
        <path d="M40 224 C58 236 142 236 160 224" opacity="0.5" />

        {/* Glass highlights */}
        <path d="M56 108 C50 132 50 168 54 196" opacity="0.45" />
        <path d="M66 112 C62 134 62 162 64 186" opacity="0.3" />

        {/* Twine + heart tag */}
        <path d="M150 62 C160 70 158 82 148 88" />
        <path d="M150 62 C162 74 164 90 156 102" opacity="0.7" />
        <path d="M148 56 C144 46 132 44 128 52 C124 58 128 66 140 74 C152 66 156 58 152 52 C148 44 148 50 148 56 Z" />
      </g>
    </svg>
  );
}
