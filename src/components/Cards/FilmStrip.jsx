import { Card } from './Card';
import { FilmCanister } from '../SVG/FilmCanister';
import { StarDoodle } from '../SVG/StarDoodle';

// Camera placeholder for frames with no photo yet.
function CameraIcon() {
  return (
    <svg viewBox="0 0 40 34" fill="none" aria-hidden="true" className="film-frame__icon">
      <g stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.8" strokeLinejoin="round">
        <rect x="3" y="9" width="34" height="22" rx="3" />
        <path d="M14 9 L16 4 H24 L26 9" />
        <circle cx="20" cy="20" r="6" />
      </g>
    </svg>
  );
}

// Film pulls out of the canister and the frames develop left to right.
// `revealedCount` is driven by the container's timer.
export function FilmStrip({
  heading,
  photos = [],
  emptyHint,
  placeholderText,
  revealedCount = 0,
  isVisible,
}) {
  const hasEmpty = photos.some((p) => !p.src);

  return (
    <Card isVisible={isVisible} className="film-strip-card">
      <h2 className="film-strip__heading script">
        {heading}
        <span className="film-strip__heart" aria-hidden="true">♥</span>
      </h2>

      <div className="film-strip__rig">
        <FilmCanister className="film-strip__canister" />

        <div className={`film-strip__track ${isVisible ? 'is-out' : ''}`}>
          {photos.map((photo, i) => (
            <div key={i} className={`film-frame ${i < revealedCount ? 'is-developed' : ''}`}>
              <div className="film-frame__inner">
                {photo.src ? (
                  <img className="film-frame__img" src={photo.src} alt={photo.alt} loading="lazy" />
                ) : (
                  <div className="film-frame__placeholder">
                    <CameraIcon />
                    <span className="film-frame__placeholder-text">{placeholderText}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <StarDoodle className="film-strip__star" />
      {hasEmpty ? <p className="film-strip__hint">{emptyHint}</p> : null}
    </Card>
  );
}
