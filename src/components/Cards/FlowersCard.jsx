import { Card } from './Card';
import { RoseBouquet } from '../SVG/RoseBouquet';
import { KissMark } from '../SVG/KissMark';
import { RosetteBadge } from '../SVG/RosetteBadge';
import { SparkleCluster } from '../SVG/SparkleCluster';

// Flowers card: bouquet springs up from the bottom edge, kiss print stamps
// itself down beside it. Petal rain is spawned by the container into
// `.flowers-card__stage`.
export function FlowersCard({ heading, isVisible, stageRef, bouquetSrc }) {
  return (
    <Card isVisible={isVisible} className="flowers-card">
      <RosetteBadge className="flowers-card__rosette" />
      <SparkleCluster className="flowers-card__sparkles" />

      <h2 className="flowers-card__heading script">{heading}</h2>

      <div className="flowers-card__stage" ref={stageRef}>
        <div className={`flowers-card__bouquet ${isVisible ? 'is-in' : ''}`}>
          {bouquetSrc ? <img src={bouquetSrc} alt="" /> : <RoseBouquet />}
        </div>
      </div>

      <KissMark className={`flowers-card__kiss ${isVisible ? 'is-stamped' : ''}`} />
      <span className="card__mini-heart" aria-hidden="true">♥</span>
    </Card>
  );
}
