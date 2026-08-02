// Paper grain + soft creases laid over a card's flat fill.
// Absolutely positioned; the card supplies the box and the base colour.
export function PaperTexture({ src }) {
  if (src) {
    return <div className="paper" style={{ backgroundImage: `url(${src})` }} aria-hidden="true" />;
  }

  return (
    <div className="paper" aria-hidden="true">
      <div className="paper__grain" />
      <div className="paper__creases" />
    </div>
  );
}
