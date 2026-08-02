import { useEffect, useRef, useState, useCallback } from 'react';

// Wraps an HTMLAudioElement. No-op API when src is empty.
// Returns { isPlaying, play, pause, toggle, fadeIn, enabled }.
export function useAudio(src) {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const enabled = Boolean(src);

  useEffect(() => {
    if (!enabled) return undefined;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      if (fadeRef.current) clearInterval(fadeRef.current);
      audioRef.current = null;
    };
  }, [src, enabled]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.play().catch(() => {});
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, []);

  const fadeIn = useCallback((target = 0.6, duration = 1000) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current) clearInterval(fadeRef.current);
    audio.volume = 0;
    audio.play().catch(() => {});
    const start = performance.now();
    fadeRef.current = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / duration);
      audio.volume = t * target;
      if (t >= 1) clearInterval(fadeRef.current);
    }, 40);
  }, []);

  return { isPlaying, play, pause, toggle, fadeIn, enabled };
}
