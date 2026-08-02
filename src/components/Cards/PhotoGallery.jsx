import { Card } from './Card';

// Polaroid grid. Only photos with a src are passed in; `rotations` comes from
// the container so the scatter is stable across renders.
export function PhotoGallery({ heading, photos = [], rotations = [], isVisible, stageRef }) {
  return (
    <Card isVisible={isVisible} className="photo-gallery-card">
      <h2 className="photo-gallery__heading script">{heading}</h2>

      <div className="photo-gallery__grid" ref={stageRef}>
        {photos.map((photo, i) => (
          <figure
            key={photo.src}
            className={`polaroid ${isVisible ? 'is-in' : ''} ${i % 2 === 0 ? 'from-left' : 'from-right'}`}
            style={{ '--rot': `${rotations[i] ?? 0}deg`, transitionDelay: `${i * 130}ms` }}
          >
            <img className="polaroid__img" src={photo.src} alt={photo.alt} loading="lazy" />
            {photo.alt ? <figcaption className="polaroid__caption">{photo.alt}</figcaption> : null}
          </figure>
        ))}
      </div>
    </Card>
  );
}
