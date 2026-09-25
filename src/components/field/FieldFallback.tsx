/**
 * Static stand-in for the field: the calibrated board, held still, with
 * registration marks. Used without WebGL, on low-end touch devices, and
 * under reduced motion.
 */
export function FieldFallback() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="field-cells" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect x="5" y="5" width="4" height="4" fill="var(--ink)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#field-cells)" opacity="0.16" />
      </svg>
      {[
        { left: 6, top: 'calc(var(--nav-h) + 6px)' },
        { right: 'calc(6px + var(--ruler-w))', top: 'calc(var(--nav-h) + 6px)' },
        { left: 6, bottom: 6 },
        { right: 'calc(6px + var(--ruler-w))', bottom: 6 },
      ].map((pos, i) => (
        <svg key={i} className="absolute h-3.5 w-3.5 opacity-60" style={pos} viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="3.5" fill="none" stroke="var(--ink-muted)" strokeWidth="1" />
          <path d="M7 0v14M0 7h14" stroke="var(--ink-muted)" strokeWidth="1" />
        </svg>
      ))}
    </div>
  )
}
