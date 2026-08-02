import { PaperTexture } from '../Stage/PaperTexture';
import { DoodleFrame } from '../SVG/DoodleFrame';

// The sheet of card stock every section sits on: sharp corners, paper grain,
// and the looping doodle border. Fills the stage box so the fixed envelope
// frame lines up with it exactly.
//
// `isVisible` runs the entrance; `frame={false}` drops the doodle border for
// cards that supply their own edge treatment.
export function Card({
  isVisible = false,
  frame = true,
  paperSrc,
  className = '',
  children,
}) {
  return (
    <article className={`card ${isVisible ? 'is-visible' : ''} ${className}`}>
      <PaperTexture src={paperSrc} />
      {frame ? <DoodleFrame /> : null}
      <div className="card__content">{children}</div>
    </article>
  );
}
