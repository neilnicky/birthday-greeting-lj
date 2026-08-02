// Pure particle spawn / update / cleanup functions.
// No DOM ownership here beyond creating detached elements; the hook mounts them.

import { randomBetween, randomPick } from './random';

const SHAPE_CLASS = {
  circle: 'p-circle',
  square: 'p-square',
  heart: 'p-heart',
  star: 'p-star',
  petal: 'p-petal',
};

// Build a single particle DOM node + physics state from emit options.
export function spawnParticle(opts, containerRect) {
  const {
    origin = { x: 0.5, y: 0.5 },
    spread = 360,
    velocity = { min: 2, max: 6 },
    lifetime = 1400,
    gravity = 0.12,
    colors = ['#d42b2b'],
    shapes = ['circle'],
    size = { min: 6, max: 12 },
    spin = 4,
    fadeOut = true,
    trail = false,
  } = opts;

  const el = document.createElement('div');
  const shape = randomPick(shapes);
  el.className = `particle ${SHAPE_CLASS[shape] || 'p-circle'}`;

  const s = randomBetween(size.min, size.max);
  const color = randomPick(colors);
  el.style.width = `${s}px`;
  el.style.height = `${s}px`;
  // Circle/square fill inline; heart/star/petal fill via the --p-color CSS var
  // so their clip-path / border-radius shaping isn't fought by a shorthand.
  if (shape === 'circle' || shape === 'square') el.style.background = color;
  el.style.setProperty('--p-color', color);

  // Launch geometry
  const baseAngle = -90; // up
  const angle = baseAngle + randomBetween(-spread / 2, spread / 2);
  const rad = (angle * Math.PI) / 180;
  const speed = randomBetween(velocity.min, velocity.max);

  const x = origin.x * containerRect.width;
  const y = origin.y * containerRect.height;

  return {
    el,
    x,
    y,
    vx: Math.cos(rad) * speed,
    vy: Math.sin(rad) * speed,
    gravity,
    rotation: randomBetween(0, 360),
    spin: randomBetween(-spin, spin),
    life: lifetime,
    maxLife: lifetime,
    fadeOut,
    trail,
    size: s,
    color,
    born: performance.now(),
  };
}

// Advance one particle by dt (ms). Mutates + writes transform. Returns alive bool.
export function updateParticle(p, dtFrames) {
  p.vy += p.gravity * dtFrames;
  p.x += p.vx * dtFrames;
  p.y += p.vy * dtFrames;
  p.rotation += p.spin * dtFrames;
  p.life -= dtFrames * (1000 / 60);

  const t = Math.max(0, p.life / p.maxLife);
  const opacity = p.fadeOut ? t : 1;
  p.el.style.opacity = opacity.toFixed(3);
  p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`;

  return p.life > 0;
}

export function destroyParticle(p) {
  if (p.el && p.el.parentNode) p.el.parentNode.removeChild(p.el);
}
