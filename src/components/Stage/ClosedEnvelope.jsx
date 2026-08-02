// The sealed envelope, edge to edge. Diagonal fold flaps form the classic X;
// the top flap swings open and the whole sheet fades to reveal the felt table
// and the first card behind it. The wax seal lives in EnvelopeFrame so it can
// travel continuously from here to the top of the screen.
export function ClosedEnvelope({ isOpen, hintText }) {
  return (
    <div className={`closed-envelope ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
      <div className="closed-envelope__flap closed-envelope__flap--left" />
      <div className="closed-envelope__flap closed-envelope__flap--right" />
      <div className="closed-envelope__flap closed-envelope__flap--bottom" />
      <div className="closed-envelope__creases" />
      <div className="closed-envelope__flap closed-envelope__flap--top" />
      <p className="closed-envelope__hint">{hintText}</p>
    </div>
  );
}
