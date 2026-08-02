import { Card } from './Card';
import { MasonJar } from '../SVG/MasonJar';

// Jar of reasons. Slips sit in the jar until they fly out one at a time and
// unfold beside it — `activeIndex` is driven by the container's timer, and
// `remaining` shrinks the pile still inside the glass.
export function LoveJar({ heading, reasons = [], activeIndex = -1, remaining = 0, isVisible }) {
  const active = activeIndex >= 0 ? reasons[activeIndex] : null;

  return (
    <Card isVisible={isVisible} className="love-jar-card">
      <div className="love-jar__jar">
        <MasonJar />
        <div className="love-jar__pile" aria-hidden="true">
          {reasons.map((reason, i) => (
            <span
              key={reason}
              className={`love-jar__slip ${i < remaining ? '' : 'is-gone'}`}
              style={{ '--slot': i }}
            />
          ))}
        </div>
      </div>

      <div className="love-jar__side">
        <h2 className="love-jar__heading script">{heading}</h2>

        <div className="love-jar__stage">
          {/* One live region so a screen reader hears each reason as it lands. */}
          <p className="love-jar__note" key={activeIndex} aria-live="polite">
            {active}
          </p>
        </div>
      </div>
    </Card>
  );
}
