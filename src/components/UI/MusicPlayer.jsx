// Floating glass play/pause button. Labels arrive as props.
export function MusicPlayer({ isPlaying, onToggle, playLabel, pauseLabel }) {
  return (
    <button
      type="button"
      className={`music-player ${isPlaying ? 'is-playing' : ''}`}
      onClick={onToggle}
      aria-label={isPlaying ? pauseLabel : playLabel}
      aria-pressed={isPlaying}
    >
      {isPlaying ? (
        <span className="music-player__eq" aria-hidden="true">
          <i /><i /><i />
        </span>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M8 3 L8 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 4 C12 3 15 4 15 4 L15 7 C15 7 12 6 8 7Z" fill="currentColor" />
          <circle cx="6" cy="15" r="2.4" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
