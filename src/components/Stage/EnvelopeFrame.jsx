import { WaxSealSVG } from './WaxSealSVG';

// The persistent envelope frame: bottom pocket corners, the flap tips that
// peek out from behind the seal, and the seal itself.
//
// Fixed to the viewport and sized to the same stage box as the scrolling
// cards, so it always registers with whichever card is on screen. The seal is
// the only interactive element — everything else is pointer-transparent.
//
// The seal stays live in both states: clicking it opens the envelope, clicking
// it again re-seals. Only the accessible name changes.
export function EnvelopeFrame({
  isOpen,
  onSealClick,
  sealAriaLabel,
  sealCloseAriaLabel,
  sealSrc,
  goldLight,
  gold,
  goldDark,
}) {
  return (
    <div className={`frame ${isOpen ? 'is-open' : ''}`}>
      <div className="frame__flap-tips" aria-hidden="true" />
      <div className="frame__pocket" aria-hidden="true" />

      <button
        type="button"
        className={`seal ${isOpen ? 'is-open' : ''}`}
        onClick={onSealClick}
        aria-label={isOpen ? sealCloseAriaLabel : sealAriaLabel}
      >
        <span className="seal__inner">
          {sealSrc ? (
            <img src={sealSrc} alt="" />
          ) : (
            <WaxSealSVG
              goldLight={goldLight}
              gold={gold}
              goldDark={goldDark}
              title={sealAriaLabel}
            />
          )}
        </span>
      </button>
    </div>
  );
}
