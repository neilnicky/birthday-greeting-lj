// Compact Spotify embed, pinned bottom-left.
//
// It is mounted only once the envelope has been opened: breaking the wax seal
// is a real user gesture, which is the strongest autoplay signal the page can
// give the iframe. Even so, Spotify's embed usually still needs one tap —
// browsers block cross-origin autoplay, and a logged-out listener gets a 30s
// preview rather than the full track. Nothing here can change that.

// Accepts either a share link (https://open.spotify.com/track/<id>?si=…),
// an embed link, or a spotify:track:<id> URI.
export function spotifyEmbedSrc(url) {
  if (!url) return null;

  const uri = url.match(/^spotify:(track|album|playlist|episode):([A-Za-z0-9]+)/);
  if (uri) return `https://open.spotify.com/embed/${uri[1]}/${uri[2]}`;

  const web = url.match(
    /open\.spotify\.com\/(?:embed\/)?(track|album|playlist|episode)\/([A-Za-z0-9]+)/,
  );
  if (web) return `https://open.spotify.com/embed/${web[1]}/${web[2]}`;

  return null;
}

export function SpotifyPlayer({ url, label }) {
  const base = spotifyEmbedSrc(url);
  if (!base) return null;

  return (
    <div className="spotify-player">
      <iframe
        title={label}
        src={`${base}?utm_source=generator&autoplay=1`}
        width="100%"
        height="80"
        frameBorder="0"
        loading="lazy"
        allow="autoplay; encrypted-media; clipboard-write; fullscreen; picture-in-picture"
      />
    </div>
  );
}
