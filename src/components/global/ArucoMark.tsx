/**
 * ArUco-style marker: black border around a 4×4 grid of bits.
 * The 16 bits are "SW" in ASCII, read row-major:
 *   S = 0101 0011, W = 0101 0111  →  0101 / 0011 / 0101 / 0111   (1 = white)
 */
const BITS = ['0101', '0011', '0101', '0111']

export function ArucoMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 8 8"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* quiet zone, then the black border + field */}
      <rect width="8" height="8" fill="var(--marker-light)" />
      <rect x="1" y="1" width="6" height="6" fill="var(--marker-dark)" />
      {BITS.flatMap((row, r) =>
        row.split('').map((bit, c) =>
          bit === '1' ? <rect key={`${r}-${c}`} x={c + 2} y={r + 2} width="1" height="1" fill="var(--marker-light)" /> : null,
        ),
      )}
    </svg>
  )
}
