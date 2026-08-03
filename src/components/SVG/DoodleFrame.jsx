// The looping hand-drawn border that runs around every card in the reference:
// a wavy line down each side, round cursive loops at the corners, and a tapered
// squiggle under the bottom edge.
//
// Drawn in a 1520×1000 viewBox that matches the card's aspect ratio, so it
// scales uniformly with the stage and never skews.

const f = (n) => Number(n.toFixed(1));

// A round cursive loop sitting on the running line. Wide control handles keep
// the bulb circular, with just a small pinch where the stroke crosses itself.
function loop(cx, cy, rx, ry) {
  const bottom = cy + ry;
  return (
    `M ${f(cx)} ${f(bottom)}` +
    ` C ${f(cx - rx * 1.55)} ${f(cy + ry * 0.6)} ${f(cx - rx * 1.3)} ${f(cy - ry * 0.95)} ${f(cx)} ${f(cy - ry)}` +
    ` C ${f(cx + rx * 1.3)} ${f(cy - ry * 0.95)} ${f(cx + rx * 1.55)} ${f(cy + ry * 0.6)} ${f(cx)} ${f(bottom)}`
  );
}

// Smooth open curve through a list of points (midpoints on the curve, the
// supplied points on the control handles).
function wave(points) {
  if (points.length < 2) return '';
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

  let d = `M ${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const [mx, my] = mid(points[i], points[i + 1]);
    d += ` Q ${f(points[i][0])} ${f(points[i][1])} ${f(mx)} ${f(my)}`;
  }
  const last = points[points.length - 1];
  d += ` T ${f(last[0])} ${f(last[1])}`;
  return d;
}

const LEFT_EDGE = wave([
  [108, 62],
  [66, 150],
  [112, 232],
  [70, 312],
  [104, 392],
  [88, 438],
]);

const RIGHT_EDGE = wave([
  [1412, 96],
  [1456, 178],
  [1408, 262],
  [1452, 344],
  [1414, 424],
  [1430, 470],
]);

const TOP_RUN = wave([
  [116, 66],
  [196, 44],
  [300, 58],
  [430, 40],
  [700, 46],
  [1000, 38],
  [1150, 58],
  [1290, 40],
  [1400, 92],
]);

const BOTTOM_SQUIGGLE = wave([
  [612, 928],
  [700, 906],
  [800, 934],
  [900, 908],
  [986, 926],
]);

export function DoodleFrame({ color = 'var(--ink-red)', opacity = 1 }) {
  return (
    <svg
      className="doodle-frame"
      viewBox="0 0 1520 1000"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke={color}
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      >
        {/* Running lines */}
        <path d={TOP_RUN} />
        <path d={LEFT_EDGE} />
        <path d={RIGHT_EDGE} />
        <path d={BOTTOM_SQUIGGLE} strokeWidth="5.4" />

        {/* Top-left pair */}
        <path d={loop(246, 88, 40, 44)} />
        <path d={loop(352, 84, 42, 46)} />

        {/* Top-right pair */}
        <path d={loop(1188, 88, 38, 42)} />
        <path d={loop(1298, 80, 42, 46)} />

        {/* Terminal curls on the side waves */}
        <path d={loop(80, 448, 20, 20)} />
        <path d={loop(1436, 482, 22, 22)} />

        {/* Bottom-right pair */}
        <path d={loop(1176, 912, 40, 44)} />
        <path d={loop(1288, 898, 42, 46)} />
      </g>
    </svg>
  );
}
