// Right-side dot navigation. One dot per section. Doubles as the TV/remote
// affordance, so the dots are sized in stage units for 10-foot legibility.
// dots: [{ id, label }], activeIndex, onDotClick(index), navLabel (aria).
export function SectionDots({ dots = [], activeIndex = 0, onDotClick, navLabel, hidden = false }) {
  return (
    <nav
      className={`section-dots ${hidden ? 'is-hidden' : ''}`}
      aria-label={navLabel}
      aria-hidden={hidden ? 'true' : undefined}
    >
      {dots.map((dot, i) => (
        <button
          key={dot.id}
          type="button"
          className={`section-dots__dot ${i === activeIndex ? 'is-active' : ''}`}
          aria-label={dot.label}
          aria-current={i === activeIndex ? 'true' : undefined}
          tabIndex={hidden ? -1 : 0}
          onClick={() => onDotClick && onDotClick(i)}
        />
      ))}
    </nav>
  );
}
