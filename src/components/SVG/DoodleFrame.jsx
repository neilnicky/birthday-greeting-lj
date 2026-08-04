// The looping hand-drawn border that runs around every card in the reference:
// a wavy line down each side, round cursive loops at the corners, and a tapered
// squiggle under the bottom edge.
//
// Two layouts are emitted — one drawn for the landscape card, one for the
// portrait card — and CSS shows whichever matches the current orientation.
// A single artwork cannot serve both: `meet` would float the border in the
// middle of the card and `none` would squash the loops into ovals.

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

// ── Landscape card: 1520 × 1000 ──
const LANDSCAPE = {
  viewBox: '0 0 1520 1000',
  stroke: 4.6,
  squiggleStroke: 5.4,
  runs: [
    wave([[116, 66], [196, 44], [300, 58], [430, 40], [700, 46], [1000, 38], [1150, 58], [1290, 40], [1400, 92]]),
    wave([[108, 62], [66, 150], [112, 232], [70, 312], [104, 392], [88, 438]]),
    wave([[1412, 96], [1456, 178], [1408, 262], [1452, 344], [1414, 424], [1430, 470]]),
  ],
  squiggle: wave([[612, 928], [700, 906], [800, 934], [900, 908], [986, 926]]),
  loops: [
    [246, 88, 40, 44],
    [352, 84, 42, 46],
    [1188, 88, 38, 42],
    [1298, 80, 42, 46],
    [80, 448, 20, 20],
    [1436, 482, 22, 22],
    [1176, 912, 40, 44],
    [1288, 898, 42, 46],
  ],
};

// ── Portrait card: 1000 × 2400. In portrait the stage is the viewport, so the
// sheet is close to full-bleed and much taller than it is wide. Same vocabulary
// as the landscape layout, stretched over that height: the side waves run the
// full drop and the loops sit in the far corners. ──
const PORTRAIT = {
  viewBox: '0 0 1000 2400',
  stroke: 8.5,
  squiggleStroke: 9.8,
  runs: [
    wave([[112, 128], [220, 96], [360, 114], [560, 94], [740, 112], [860, 94], [916, 160]]),
    wave([[104, 124], [56, 420], [112, 700], [58, 980], [110, 1260], [60, 1520], [102, 1740], [84, 1866]]),
    wave([[924, 168], [972, 470], [914, 750], [968, 1030], [912, 1310], [966, 1570], [920, 1790], [938, 1916]]),
  ],
  squiggle: wave([[330, 2250], [450, 2216], [560, 2258], [670, 2220], [760, 2246]]),
  loops: [
    [230, 150, 44, 50],
    [346, 144, 46, 52],
    [700, 150, 42, 48],
    [812, 142, 46, 52],
    [74, 1890, 24, 24],
    [946, 1942, 26, 26],
    [700, 2232, 44, 50],
    [814, 2214, 46, 52],
  ],
};

function Frame({ layout, color, opacity, className }) {
  return (
    <svg
      className={`doodle-frame ${className}`}
      viewBox={layout.viewBox}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke={color}
        strokeWidth={layout.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      >
        {layout.runs.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
        <path d={layout.squiggle} strokeWidth={layout.squiggleStroke} />
        {layout.loops.map(([cx, cy, rx, ry]) => (
          <path key={`${cx}-${cy}`} d={loop(cx, cy, rx, ry)} />
        ))}
      </g>
    </svg>
  );
}

export function DoodleFrame({ color = 'var(--ink-red)', opacity = 1 }) {
  return (
    <>
      <Frame layout={LANDSCAPE} color={color} opacity={opacity} className="doodle-frame--landscape" />
      <Frame layout={PORTRAIT} color={color} opacity={opacity} className="doodle-frame--portrait" />
    </>
  );
}
