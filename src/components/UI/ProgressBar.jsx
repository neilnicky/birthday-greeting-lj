// Top scroll-progress line. progress: 0-1.
export function ProgressBar({ progress = 0 }) {
  return (
    <div className="progress-bar" aria-hidden="true">
      <div className="progress-bar__fill" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}
