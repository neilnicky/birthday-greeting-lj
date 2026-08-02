// Pure random helpers — no content, decorative math only.

export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

export function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Returns an rgb() string in a warm red/pink/gold family by default.
export function randomColor(colors) {
  if (colors && colors.length) return randomPick(colors);
  const h = randomInt(340, 400) % 360; // wraps into reds
  return `hsl(${h}, ${randomInt(55, 85)}%, ${randomInt(55, 70)}%)`;
}

// Deterministic-ish rotation for polaroids etc.
export function randomRotation(min = -6, max = 6) {
  return randomBetween(min, max);
}
