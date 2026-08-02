import { Card } from './Card';
import { ClawArm } from '../SVG/ClawArm';
import { SparkleCluster } from '../SVG/SparkleCluster';
import { HeartDoodles } from '../SVG/HeartDoodles';

// Where the trait hearts sit in the pile along the bottom edge.
const PILE = [
  { left: 6, bottom: -4, size: 20, tilt: -8, shade: 'dark' },
  { left: 18, bottom: 1, size: 26, tilt: 6, shade: 'light' },
  { left: 60, bottom: 1, size: 26, tilt: -5, shade: 'light' },
  { left: 74, bottom: -3, size: 21, tilt: 9, shade: 'dark' },
];

// The claw drops from behind the wax seal, closes on the gem heart and lifts
// it clear of the pile. `phase`: 'idle' | 'drop' | 'grip' | 'lift'.
export function ClawMachine({ intro, subtitle, gemText, traits = [], phase = 'idle', isVisible }) {
  return (
    <Card isVisible={isVisible} className="claw-card">
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
