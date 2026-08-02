import { Card } from './Card';
import { BalloonCluster } from '../SVG/BalloonCluster';
import { GiftBox } from '../SVG/GiftBox';
import { CakeSlice } from '../SVG/CakeSlice';
import { SparkleCluster } from '../SVG/SparkleCluster';

// Make-a-wish card. The candle is the interactive bit: the whole slice is a
// button so it works with a click, a tap, or Enter from a remote.
export function WishCard({ heading, subtext, buttonLabel, hasBlown, onBlow, isVisible }) {
  return (
    <Card isVisible={isVisible} className="wish-card">
      <SparkleCluster className="wish-card__sparkles" />

      <h2 className="wish-card__heading script">{heading}</h2>

      <div className="wish-card__scene">
        <BalloonCluster className="wish-card__balloons" />

        <div className="wish-card__cake">
          <p className="wish-card__subtext">{subtext}</p>
          <button
            type="button"
            className="wish-card__blow"
            onClick={onBlow}
            aria-label={buttonLabel}
            aria-pressed={hasBlown}
          >
            <CakeSlice lit={!hasBlown} />
            <span className={`wish-card__smoke ${hasBlown ? 'is-rising' : ''}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        <GiftBox className="wish-card__gift" />
      </div>

      <span className="card__mini-heart" aria-hidden="true">♥</span>
    </Card>
  );
}
