// Cuts the gold wax seal out of the supplied reference art and writes a real
// RGBA PNG.
//
// The reference (public/assets/Wax Seal Image Guidance.png) looks transparent
// but isn't: it is a screenshot of a transparent PNG, so the editor's
// checkerboard is baked in as literal pixels and every alpha byte is 255.
//
// The separation is easy because the checkerboard, the seal's cast shadow on it
// and the stock watermark are all neutral grey (R≈G≈B), while the seal is
// strongly gold (chroma is 94+ across its whole interior). So chroma keys it.
//
// Two details matter for a rim that doesn't look cheap:
//
//   * Alpha is a ramp, not a threshold. The reference's own antialiasing spreads
//     the edge over ~4 px (chroma climbs 6 → 25 → 44 → 67 → 93 → plateau), so
//     mapping that climb onto 0→1 reproduces the original soft edge instead of
//     stair-stepping a hard cut.
//   * Colour never comes from the ramp. Those pixels are gold already blended
//     with grey, and using them paints a dull halo round the seal. Colour is
//     sampled only from eroded core pixels and dilated outwards, so the rim
//     fades out in pure gold.
//
// Photographic gold is a poor fit for PNG (821 KB), so the final asset is WebP
// via cwebp — 45 KB, and a decode-and-diff shows no damage to the rim. Without
// cwebp on PATH the PNG is written instead.
//
// One-off. Run with `node scripts/extract-wax-seal.mjs`; the output is committed.

import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { deflateSync, inflateSync } from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = resolve(ROOT, 'public/assets/Wax Seal Image Guidance.png');
const OUTPUT_WEBP = resolve(ROOT, 'public/assets/wax-seal.webp');
const OUTPUT_PNG = resolve(ROOT, 'public/assets/wax-seal.png');

// Chroma below this is background: the checkerboard sits at 0-6 after the
// source's JPEG-ish noise, so 8 clears it without eating any of the edge ramp.
const CHROMA_FLOOR = 8;
// Chroma at or above this is solid seal. The interior's 1st percentile is 94,
// so nothing inside the wax — not even the darkest shaded rim — falls through.
const CHROMA_CORE = 90;
// Core pixels sit at ~77% coverage on their outer edge, so they are still a
// little grey-contaminated. Pull back this far before trusting a pixel's colour.
const CORE_ERODE = 2;
// How far the alpha ramp may reach beyond the core. The source edge is ~4 px;
// this caps it so distant noise can never open up a stray speck.
const RAMP_REACH = 8;
// Native crop is 724x689; keeping it 1:1 avoids resampling the texture at all.
const OUTPUT_WIDTH = 724;
const PAD = 2;

// ── PNG decode ──────────────────────────────────────────────────────────────

function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');

  let pos = 8;
  let header = null;
  const idat = [];

  while (pos < buf.length) {
    const length = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + length);

    if (type === 'IHDR') {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        depth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }

    pos += 12 + length;
  }

  if (!header) throw new Error('no IHDR');
  if (header.depth !== 8 || header.colorType !== 6 || header.interlace !== 0) {
    throw new Error(
      `expected 8-bit non-interlaced RGBA, got depth=${header.depth} colorType=${header.colorType} interlace=${header.interlace}`,
    );
  }

  const { width, height } = header;
  const bpp = 4;
  const stride = width * bpp;
  const raw = inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(height * stride);

  // Undo the per-scanline filters. `prev` is the already-reconstructed row above.
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const src = (y * (stride + 1)) + 1;
    const dst = y * stride;
    const up = dst - stride;

    for (let x = 0; x < stride; x += 1) {
      const value = raw[src + x];
      const a = x >= bpp ? out[dst + x - bpp] : 0;
      const b = y > 0 ? out[up + x] : 0;
      const c = y > 0 && x >= bpp ? out[up + x - bpp] : 0;

      let recon;
      switch (filter) {
        case 0: recon = value; break;
        case 1: recon = value + a; break;
        case 2: recon = value + b; break;
        case 3: recon = value + ((a + b) >> 1); break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          const pred = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          recon = value + pred;
          break;
        }
        default: throw new Error(`bad filter ${filter} on row ${y}`);
      }

      out[dst + x] = recon & 0xff;
    }
  }

  return { width, height, data: out };
}

// ── PNG encode ──────────────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const out = Buffer.alloc(body.length + 8);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), body.length + 4);
  return out;
}

function encodePng(width, height, rgba) {
  const stride = width * 4;
  // Filter 0 throughout: the seal is photographic, so the fancy filters buy
  // little and deflate level 9 does the real work.
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // colour type: RGBA
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Extraction ──────────────────────────────────────────────────────────────

// Per-pixel gold saturation. Neutral greys — checkerboard, cast shadow,
// watermark — land at 0-6; the seal's interior sits at 94-135.
function buildChroma({ width, height, data }) {
  const chroma = new Uint8Array(width * height);
  for (let i = 0, p = 0; i < chroma.length; i += 1, p += 4) {
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    if (r > b) chroma[i] = Math.max(r, g, b) - Math.min(r, g, b);
  }
  return chroma;
}

function erode(mask, width, height, radius) {
  const out = new Uint8Array(mask.length);
  for (let y = radius; y < height - radius; y += 1) {
    for (let x = radius; x < width - radius; x += 1) {
      let solid = 1;
      for (let dy = -radius; dy <= radius && solid; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (!mask[(y + dy) * width + x + dx]) { solid = 0; break; }
        }
      }
      out[y * width + x] = solid;
    }
  }
  return out;
}

// Alpha is 1 across the core and follows the source's own edge ramp outside it,
// which is what keeps the rim smooth instead of stair-stepped. The ramp is only
// allowed within RAMP_REACH of the core, so noise elsewhere stays invisible.
function buildAlpha(chroma, core, width, height) {
  const alpha = new Float32Array(chroma.length);
  const span = CHROMA_CORE - CHROMA_FLOOR;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x;
      if (core[i]) { alpha[i] = 1; continue; }
      if (chroma[i] <= CHROMA_FLOOR) continue;

      let near = false;
      const y0 = Math.max(y - RAMP_REACH, 0);
      const y1 = Math.min(y + RAMP_REACH, height - 1);
      const x0 = Math.max(x - RAMP_REACH, 0);
      const x1 = Math.min(x + RAMP_REACH, width - 1);
      for (let ny = y0; ny <= y1 && !near; ny += 1) {
        for (let nx = x0; nx <= x1; nx += 1) {
          if (core[ny * width + nx]) { near = true; break; }
        }
      }
      if (!near) continue;

      alpha[i] = Math.min((chroma[i] - CHROMA_FLOOR) / span, 1);
    }
  }

  return alpha;
}

// Grow the trusted core colours outwards over every pixel the ramp touches, so
// each edge pixel carries clean gold rather than gold-blended-with-checkerboard.
function dilateColour({ width, height, data }, source, alpha) {
  const rgb = new Float32Array(width * height * 3);
  const known = new Uint8Array(width * height);
  let frontier = [];

  for (let i = 0; i < known.length; i += 1) {
    if (!source[i]) continue;
    known[i] = 1;
    rgb[i * 3] = data[i * 4];
    rgb[i * 3 + 1] = data[i * 4 + 1];
    rgb[i * 3 + 2] = data[i * 4 + 2];
    frontier.push(i);
  }

  while (frontier.length) {
    const next = [];
    for (const i of frontier) {
      const x = i % width;
      const y = (i - x) / width;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const n = ny * width + nx;
          if (known[n] || alpha[n] <= 0) continue;
          known[n] = 2;  // provisional; averaged below
          next.push(n);
        }
      }
    }

    // Average each newly reached pixel over its already-settled neighbours.
    for (const n of next) {
      const x = n % width;
      const y = (n - x) / width;
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const mx = x + dx;
          const my = y + dy;
          if (mx < 0 || my < 0 || mx >= width || my >= height) continue;
          const m = my * width + mx;
          if (known[m] !== 1) continue;
          r += rgb[m * 3];
          g += rgb[m * 3 + 1];
          b += rgb[m * 3 + 2];
          count += 1;
        }
      }
      if (count) {
        rgb[n * 3] = r / count;
        rgb[n * 3 + 1] = g / count;
        rgb[n * 3 + 2] = b / count;
      }
    }
    for (const n of next) known[n] = 1;

    frontier = next;
  }

  return rgb;
}

// Flood the background inwards from the border. Non-gold pixels the flood never
// reaches are enclosed by wax — dark pits and specks in the seal's own texture —
// so they belong to the seal, not the background.
function fillEnclosedHoles(mask, width, height) {
  const outside = new Uint8Array(width * height);
  const stack = [];

  const push = (x, y) => {
    const i = y * width + x;
    if (mask[i] || outside[i]) return;
    outside[i] = 1;
    stack.push(i);
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  while (stack.length) {
    const i = stack.pop();
    const x = i % width;
    const y = (i - x) / width;
    if (x > 0) push(x - 1, y);
    if (x < width - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < height - 1) push(x, y + 1);
  }

  let filled = 0;
  for (let i = 0; i < mask.length; i += 1) {
    if (!mask[i] && !outside[i]) {
      mask[i] = 1;
      filled += 1;
    }
  }
  return filled;
}

function boundingBox(alpha, width, height) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (alpha[y * width + x] <= 0) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) throw new Error('no seal pixels found');
  return { minX, minY, maxX, maxY };
}

// Box filter from the cropped region to the output grid. Alpha averages the
// ramp; colour is an alpha-weighted average of the dilated gold, so transparent
// pixels never drag the rim's colour down.
function resample(image, alpha, rgb, box, outWidth, outHeight) {
  const { width } = image;
  const boxWidth = box.maxX - box.minX + 1;
  const boxHeight = box.maxY - box.minY + 1;
  const out = Buffer.alloc(outWidth * outHeight * 4);

  for (let oy = 0; oy < outHeight; oy += 1) {
    const y0 = box.minY + Math.floor((oy * boxHeight) / outHeight);
    const y1 = box.minY + Math.max(Math.ceil(((oy + 1) * boxHeight) / outHeight), Math.floor((oy * boxHeight) / outHeight) + 1);

    for (let ox = 0; ox < outWidth; ox += 1) {
      const x0 = box.minX + Math.floor((ox * boxWidth) / outWidth);
      const x1 = box.minX + Math.max(Math.ceil(((ox + 1) * boxWidth) / outWidth), Math.floor((ox * boxWidth) / outWidth) + 1);

      let r = 0;
      let g = 0;
      let b = 0;
      let weight = 0;
      let sum = 0;
      let total = 0;

      for (let y = y0; y < y1; y += 1) {
        for (let x = x0; x < x1; x += 1) {
          total += 1;
          const i = y * width + x;
          const a = alpha[i];
          sum += a;
          if (a <= 0) continue;
          r += rgb[i * 3] * a;
          g += rgb[i * 3 + 1] * a;
          b += rgb[i * 3 + 2] * a;
          weight += a;
        }
      }

      if (weight === 0) continue;  // fully transparent, leave the zeroed pixel
      const p = (oy * outWidth + ox) * 4;
      out[p] = Math.round(r / weight);
      out[p + 1] = Math.round(g / weight);
      out[p + 2] = Math.round(b / weight);
      out[p + 3] = Math.round(Math.min(sum / total, 1) * 255);
    }
  }

  return out;
}

// ── Main ────────────────────────────────────────────────────────────────────

const image = decodePng(readFileSync(SOURCE));
console.log(`source     ${image.width}x${image.height}`);

const chroma = buildChroma(image);

const core = new Uint8Array(chroma.length);
for (let i = 0; i < chroma.length; i += 1) core[i] = chroma[i] >= CHROMA_CORE ? 1 : 0;
const filled = fillEnclosedHoles(core, image.width, image.height);
console.log(`hole fill  ${filled} enclosed px reclaimed`);

const alpha = buildAlpha(chroma, core, image.width, image.height);
const rgb = dilateColour(image, erode(core, image.width, image.height, CORE_ERODE), alpha);

const raw = boundingBox(alpha, image.width, image.height);
const box = {
  minX: Math.max(raw.minX - PAD, 0),
  minY: Math.max(raw.minY - PAD, 0),
  maxX: Math.min(raw.maxX + PAD, image.width - 1),
  maxY: Math.min(raw.maxY + PAD, image.height - 1),
};
const boxWidth = box.maxX - box.minX + 1;
const boxHeight = box.maxY - box.minY + 1;
console.log(
  `seal bbox  x[${raw.minX}..${raw.maxX}] y[${raw.minY}..${raw.maxY}] `
  + `-> crop ${boxWidth}x${boxHeight} (aspect ${(boxWidth / boxHeight).toFixed(3)})`,
);

const outWidth = OUTPUT_WIDTH;
const outHeight = Math.round((boxHeight / boxWidth) * outWidth);
const rgba = resample(image, alpha, rgb, box, outWidth, outHeight);

const png = encodePng(outWidth, outHeight, rgba);

// -alpha_q 100 keeps the edge ramp lossless; only the gold itself is lossy.
const staging = join(tmpdir(), `wax-seal-${process.pid}.png`);
writeFileSync(staging, png);
const webp = spawnSync('cwebp', ['-q', '90', '-alpha_q', '100', '-m', '6', staging, '-o', OUTPUT_WEBP]);
unlinkSync(staging);

if (webp.status === 0) {
  console.log(`wrote      ${OUTPUT_WEBP} (${outWidth}x${outHeight})`);
} else {
  writeFileSync(OUTPUT_PNG, png);
  console.warn(`cwebp unavailable (${webp.error?.code ?? `exit ${webp.status}`}) — wrote PNG instead`);
  console.warn(`wrote      ${OUTPUT_PNG} (${outWidth}x${outHeight}); point config.assets.seal at the .png`);
}
