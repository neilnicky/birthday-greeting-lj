import { Card } from './Card';
import { CakeSVG } from '../SVG/CakeSVG';
import { TulipBouquet } from '../SVG/TulipBouquet';
import { HeartDoodles } from '../SVG/HeartDoodles';

// The card that slides out of the envelope: script greeting up top, bouquets
// flanking a cake along the bottom edge.
export function BirthdayCard({ heading, name, date, isVisible }) {
  return (
    <Card isVisible={isVisible} className="birthday-card">
      <span className="card__date">{date}</span>
      <HeartDoodles className="birthday-card__hearts" />

      <h2 className="birthday-card__heading script">
        <span className="birthday-card__line-1">{heading}</span>
        <span className="birthday-card__line-2">{name}</span>
      </h2>

      <div className="birthday-card__scene" aria-hidden="true">
        <TulipBouquet className="birthday-card__tulip birthday-card__tulip--left" />
        <CakeSVG candles={5} className="birthday-card__cake" />
        <TulipBouquet flip className="birthday-card__tulip birthday-card__tulip--right" />
      </div>
    </Card>
  );
}
