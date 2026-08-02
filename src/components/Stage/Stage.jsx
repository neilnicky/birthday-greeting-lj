// One full-viewport scroll step containing one aspect-locked stage.
// Sections wrap their card in this so every card lands in exactly the same
// box as the fixed envelope frame.
export function Scene({ id, ariaLabel, sectionRef, children }) {
  return (
    <section
      ref={sectionRef}
      className="scene"
      data-section={id}
      aria-label={ariaLabel}
      tabIndex={-1}
    >
      <div className="stage">{children}</div>
    </section>
  );
}
