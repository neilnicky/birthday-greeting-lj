import { useEffect, useRef, useCallback } from 'react';
import { spawnParticle, updateParticle, destroyParticle } from '../utils/particlePhysics';
import { prefersReducedMotion } from './useReducedMotion';

const MAX_PARTICLES = 80;

// Particle system bound to a container element.
// If containerRef is omitted, a fixed full-viewport overlay is created + reused.
// Returns { emit(options) }.
export function useParticles(containerRef) {
  const localRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const layerRef = useRef(null);

  // Resolve (or lazily create) the spawn layer.
  const getLayer = useCallback(() => {
    if (layerRef.current) return layerRef.current;

    if (containerRef && containerRef.current) {
      const host = containerRef.current;
      const layer = document.createElement('div');
      layer.className = 'particle-layer';
      host.appendChild(layer);
      layerRef.current = layer;
      return layer;
    }

    // Global overlay fallback.
    const overlay = document.createElement('div');
    overlay.className = 'particle-layer particle-layer--global';
    document.body.appendChild(overlay);
    layerRef.current = overlay;
    localRef.current = overlay;
    return overlay;
  }, [containerRef]);

  const loop = useCallback((now) => {
    const dt = lastRef.current ? (now - lastRef.current) / (1000 / 60) : 1;
    lastRef.current = now;
    const dtFrames = Math.min(dt, 3);

    const alive = [];
    for (const p of particlesRef.current) {
      if (updateParticle(p, dtFrames)) alive.push(p);
      else destroyParticle(p);
    }
    particlesRef.current = alive;

    if (alive.length > 0) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      rafRef.current = null;
      lastRef.current = 0;
    }
  }, []);

  const emit = useCallback(
    (opts = {}) => {
      if (prefersReducedMotion()) return;

      const layer = getLayer();
      const rect = layer.getBoundingClientRect();
      const box = {
        width: rect.width || window.innerWidth,
        height: rect.height || window.innerHeight,
      };

      const count = opts.count || 20;
      for (let i = 0; i < count; i += 1) {
        if (particlesRef.current.length >= MAX_PARTICLES) break;
        const p = spawnParticle(opts, box);
        layer.appendChild(p.el);
        particlesRef.current.push(p);
      }

      if (!rafRef.current) {
        lastRef.current = 0;
        rafRef.current = requestAnimationFrame(loop);
      }
    },
    [getLayer, loop],
  );

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      particlesRef.current.forEach(destroyParticle);
      particlesRef.current = [];
      if (localRef.current && localRef.current.parentNode) {
        localRef.current.parentNode.removeChild(localRef.current);
      }
    };
  }, []);

  return { emit };
}
