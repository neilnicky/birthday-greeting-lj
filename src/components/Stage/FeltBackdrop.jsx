// Fixed red-fabric backdrop. Fills the viewport at any aspect ratio, so the
// aspect-locked stage can letterbox onto it without showing a hard edge.
// Procedural by default; `src` swaps in a real photo with no other change.
export function FeltBackdrop({ src }) {
  const style = src ? { backgroundImage: `url(${src})` } : undefined;

  return (
    <div className="felt" style={style} aria-hidden="true">
      {src ? null : (
        <>
          <div className="felt__grain" />
          <div className="felt__weave" />
        </>
      )}
      <div className="felt__vignette" />
    </div>
  );
}
