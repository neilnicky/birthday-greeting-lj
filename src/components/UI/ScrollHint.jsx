// Bouncing scroll-cue hint. text is passed in — no hardcoded content.
export function ScrollHint({ text, visible = true }) {
  return (
    <div className={`scroll-hint ${visible ? 'is-visible' : ''}`} aria-hidden="true">
      <span className="scroll-hint__text">{text}</span>
    </div>
  );
}
