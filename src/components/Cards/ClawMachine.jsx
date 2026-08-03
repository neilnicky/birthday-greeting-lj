import { Card } from './Card';
import { ClawArm } from '../SVG/ClawArm';
import { SparkleCluster } from '../SVG/SparkleCluster';
import { HeartDoodles } from '../SVG/HeartDoodles';

// Where the trait hearts sit in the pile along the bottom edge.
const PILE = [
  { left: 5, bottom: 4, size: 11, tilt: -8, shade: 'dark' },
  { left: 14, bottom: 9, size: 14, tilt: 6, shade: 'light' },
  { left: 64, bottom: 9, size: 14, tilt: -5, shade: 'light' },
  { left: 76, bottom: 4, size: 11, tilt: 9, shade: 'dark' },
];

// A heart in objectBoundingBox units, so one definition clips every heart on
// the card regardless of its size. CSS clip-path: path() would not scale.
const HEART_CLIP =
  'M0.5,0.96 C0.5,0.96 0.06,0.64 0.06,0.34 C0.06,0.15 0.21,0.04 0.34,0.09 ' +
  'C0.43,0.13 0.49,0.23 0.5,0.31 C0.51,0.23 0.57,0.13 0.66,0.09 ' +
  'C0.79,0.04 0.94,0.15 0.94,0.34 C0.94,0.64 0.5,0.96 0.5,0.96 Z';

// The claw drops from behind the wax seal, closes on the gem heart and lifts
// it clear of the pile. `phase`: 'idle' | 'drop' | 'grip' | 'lift'.
export function ClawMachine({ intro, subtitle, gemText, traits = [], phase = 'idle', isVisible }) {
  return (
    <Card isVisible={isVisible} className="claw-card">
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="claw-card__defs">
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d={HEART_CLIP} />
          </clipPath>
        </defs>
      </svg>

      <SparkleCluster className="claw-card__sparkles" />
      <HeartDoodles className="claw-card__hearts" />

      <p className="claw-card__intro">
        <span>{intro}</span>
        <span>{subtitle}</span>
      </p>

      <div className={`claw-card__rig is-${phase}`}>
        <ClawArm grip={phase === 'grip' || phase === 'lift'} className="claw-card__arm" />
        <span className="claw-card__gem">
          <span className="claw-card__gem-label">{gemText}</span>
        </span>
      </div>

      <ul className="claw-card__pile">
        {traits.map((trait, i) => {
          const slot = PILE[i % PILE.length];
          return (
            <li
              key={trait}
              className={`claw-heart claw-heart--${slot.shade}`}
              style={{
                '--left': `${slot.left}%`,
                '--bottom': `${slot.bottom}%`,
                '--size': slot.size,
                '--tilt': `${slot.tilt}deg`,
                '--delay': `${i * 120}ms`,
              }}
            >
              <span className="claw-heart__label">{trait}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
