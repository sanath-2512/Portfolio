/**
 * Static stand-in for the WebGL layer: the same node-and-edge language,
 * held still. Shown under reduced motion, before the scene lazy-loads, and
 * whenever WebGL is unavailable.
 */
const STAGES = [
  { x: 14, ys: [18, 34, 50, 66, 82], r: 0.55 },
  { x: 33, ys: [27, 43, 59, 75], r: 0.6 },
  { x: 52, ys: [35, 51, 67], r: 0.75 },
  { x: 70, ys: [43, 59], r: 1 },
  { x: 86, ys: [51], r: 1.4 },
]

const EDGES: Array<[number, number, number, number]> = []
for (let s = 0; s < STAGES.length - 1; s += 1) {
  const from = STAGES[s]
  const to = STAGES[s + 1]
  from.ys.forEach((y, i) => {
    EDGES.push([from.x, y, to.x, to.ys[Math.min(i, to.ys.length - 1)]])
    if (i + 1 < to.ys.length) EDGES.push([from.x, y, to.x, to.ys[i + 1]])
  })
}

export function ScenePoster() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="var(--color-line-strong)" strokeWidth="0.08">
        {EDGES.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      {STAGES.map((stage, index) =>
        stage.ys.map((y) => (
          <circle
            key={`${index}-${y}`}
            cx={stage.x}
            cy={y}
            r={stage.r / 2}
            fill={index >= 3 ? 'var(--color-accent)' : 'var(--color-fg-faint)'}
            opacity={index >= 3 ? 0.85 : 0.5}
          />
        )),
      )}
    </svg>
  )
}
