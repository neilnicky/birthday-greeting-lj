import { useEffect, useRef } from 'react';

// Compact Spotify embed, pinned bottom-left.
//
// This uses Spotify's IFrame API rather than a bare <iframe> because a plain
// embed URL has no way to start part-way into a track — only the API's
// controller exposes seek(). The controller is created once the envelope has
// been opened: breaking the wax seal is a real user gesture, which is the
// strongest autoplay signal the page can give it. Even so, Spotify usually
// still needs one tap, and a logged-out listener gets a ~30s preview instead
// of the full track — in that case the start offset is skipped (see below).

const API_SRC = 'https://open.spotify.com/embed/iframe-api/v1';

// Accepts a share link, an embed link, or a spotify: URI. Returns the
// spotify:<type>:<id> URI the controller wants.
export function spotifyUri(url) {
  if (!url) return null;

  const uri = url.match(/^spotify:(track|album|playlist|episode):([A-Za-z0-9]+)/);
  if (uri) return `spotify:${uri[1]}:${uri[2]}`;

  const web = url.match(
    /open\.spotify\.com\/(?:embed\/)?(track|album|playlist|episode)\/([A-Za-z0-9]+)/,
  );
  if (web) return `spotify:${web[1]}:${web[2]}`;

  return null;
}

// The API hands itself over through a single global callback, so the script is
// injected once per page and every caller shares the same promise.
let apiPromise = null;
function getIframeApi() {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    window.onSpotifyIframeApiReady = resolve;
    const script = document.createElement('script');
    script.src = API_SRC;
    script.async = true;
    document.body.appendChild(script);
  });

  return apiPromise;
}

export function SpotifyPlayer({ url, label, startSeconds = 0 }) {
  const hostRef = useRef(null);
  const uri = spotifyUri(url);

  useEffect(() => {
    if (!uri || !hostRef.current) return undefined;

    let cancelled = false;
    let controller = null;
    let didSeek = false;

    getIframeApi().then((api) => {
      if (cancelled || !hostRef.current) return;

      api.createController(
        hostRef.current,
        { uri, width: '100%', height: 80 },
        (ctrl) => {
          if (cancelled) {
            ctrl.destroy();
            return;
          }
          controller = ctrl;

          if (startSeconds > 0) {
            ctrl.addListener('playback_update', (event) => {
              const data = event?.data;
              if (!data || data.isPaused || didSeek) return;

              // `duration` is milliseconds. A logged-out listener only gets a
              // ~30s preview clip, so seeking past it would just stall — leave
              // that case playing from wherever the preview starts.
              if (!data.duration || data.duration / 1000 <= startSeconds) return;

              didSeek = true;
              ctrl.seek(startSeconds);
            });
          }

          // Best effort — silently ignored if the browser blocks it.
          ctrl.play();
        },
      );
    });

    return () => {
      cancelled = true;
      if (controller) controller.destroy();
    };
  }, [uri, startSeconds]);

  if (!uri) return null;

  return (
    <div className="spotify-player" aria-label={label}>
      <div ref={hostRef} />
    </div>
  );
}
