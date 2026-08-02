import { QRCodeSVG } from 'qrcode.react';
import { Card } from './Card';
import { BuntingBanner } from '../SVG/BuntingBanner';
import { BalloonCluster } from '../SVG/BalloonCluster';
import { CurvedArrow } from '../SVG/CurvedArrow';

// Final card: bunting overhead, the code in the middle, and an arrow that
// draws itself from the caption down to the code.
export function QRCard({ heading, url, fallbackText, isVisible }) {
  return (
    <Card isVisible={isVisible} className="qr-card">
      <BuntingBanner className="qr-card__bunting" />
      <BalloonCluster className="qr-card__balloons" />

      <div className="qr-card__code">
        {url ? (
          <QRCodeSVG value={url} size={512} level="M" bgColor="#ffffff" fgColor="#111111" />
        ) : (
          <p className="qr-card__fallback">{fallbackText}</p>
        )}
      </div>

      <div className="qr-card__caption">
        <p className="qr-card__heading">{heading}</p>
        <CurvedArrow drawn={isVisible} className="qr-card__arrow" />
      </div>
    </Card>
  );
}
