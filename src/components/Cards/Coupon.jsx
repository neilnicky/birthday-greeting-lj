import { Card } from './Card';
import { StickFigure } from '../SVG/StickFigure';

// Barcode: deterministic pseudo-random bars. Decorative — not content.
function Barcode({ bars = 42 }) {
  return (
    <span className="coupon__barcode" aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} style={{ flexGrow: 1 + ((i * 37) % 4) }} />
      ))}
    </span>
  );
}

// Love coupon: a notched ticket with a chalky deckle border, stamped in with a
// spring. All text arrives as props.
export function Coupon({
  title,
  forLine,
  usesLabel,
  usesValue,
  expiryLabel,
  expiryValue,
  isVisible,
}) {
  return (
    <Card isVisible={isVisible} className="coupon-card">
      <div className={`coupon ${isVisible ? 'is-stamped' : ''}`}>
        <span className="coupon__deckle" aria-hidden="true" />

        <StickFigure className="coupon__figure coupon__figure--left" />
        <StickFigure flip className="coupon__figure coupon__figure--right" />

        <h2 className="coupon__title">{title}</h2>

        <p className="coupon__for">{forLine}</p>
        <span className="coupon__rule" aria-hidden="true" />

        <dl className="coupon__meta">
          <div>
            <dt>{usesLabel}</dt>
            <dd>{usesValue}</dd>
          </div>
          <div>
            <dt>{expiryLabel}</dt>
            <dd>{expiryValue}</dd>
          </div>
        </dl>

        <Barcode />
      </div>
    </Card>
  );
}
