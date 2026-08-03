import { Card } from './Card';
import { CakeSVG } from '../SVG/CakeSVG';
import { BalloonCluster } from '../SVG/BalloonCluster';
import { BrushUnderline } from '../SVG/BrushUnderline';

// Handwritten letter. The greeting is script over a dry-brush rule; the body
// arrives already assembled as `typedText` from the typewriter hook.
export function LoveLetter({
  date,
  greeting,
  typedText,
  signature,
  cursorVisible,
  isComplete,
  isVisible,
}) {
  return (
    <Card isVisible={isVisible} className="love-letter">
      <span className="card__date">{date}</span>

      <div className="love-letter__greeting">
        <h2 className="script">{greeting}</h2>
        <BrushUnderline drawn={isVisible} />
      </div>

      {/* The signature sits inside the body paragraph so it flows under the
          text rather than being pinned, whatever the letter's length. */}
      <p className="love-letter__body">
        {typedText}
        <span className={`love-letter__cursor ${!isComplete && cursorVisible ? 'is-on' : ''}`}>
          |
        </span>
        {isComplete && signature ? (
          <span className="love-letter__signature script">{signature}</span>
        ) : null}
      </p>

      <CakeSVG candles={4} lit={false} className="love-letter__doodle love-letter__doodle--cake" />
      <BalloonCluster className="love-letter__doodle love-letter__doodle--balloons" />
    </Card>
  );
}
