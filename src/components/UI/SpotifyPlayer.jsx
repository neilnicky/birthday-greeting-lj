import { useEffect, useRef } from 'react';

// Compact Spotify embed, pinned bottom-left.
//
// This uses Spotify's IFrame API rather than a bare <iframe> so the track can
// open part-way in: createController takes `startAt` (seconds), which it turns
// into the embed's `t=` parameter before the iframe ever loads. Seeking after
// playback begins is far less reliable — the position is only settable once
// the embed has decided what it is streaming.
//
// `theme: 'dark'` is the API's equivalent of the embed URL's `theme=0`.
//
// The controller is created once the envelope has been opened: breaking the
// wax seal is a real user gesture, which is the strongest autoplay signal the
// page can give it.

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

export function SpotifyPlayer({ url, label, startSeconds = 0, height = 80, theme = 'dark' }) {
  const hostRef = useRef(null);
  const uri = spotifyUri(url);

  useEffect(() => {
    if (!uri || !hostRef.current) return undefined;

    let cancelled = false;
    let controller = null;

    getIframeApi().then((api) => {
      if (cancelled || !hostRef.current) return;

      api.createController(
        hostRef.current,
        { uri, width: '100%', height, theme, startAt: startSeconds || undefined },
        (ctrl) => {
          if (cancelled) {
            ctrl.destroy();
            return;
          }
          controller = ctrl;
          // Best effort — silently ignored if the browser blocks it.
          ctrl.play();
        },
      );
    });

    return () => {
      cancelled = true;
      if (controller) controller.destroy();
    };
  }, [uri, startSeconds, height, theme]);

  if (!uri) return null;

  return (
    <div className="spotify-player" aria-label={label}>
      <div ref={hostRef} />
    </div>
  );
}
