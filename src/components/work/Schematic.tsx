import { eduAI, worthyApply, agriMind, viewly } from '@/data/content'

/** Tiny, honest diagrams of each project, for the index preview. */
export function Schematic({ id }: { id: string }) {
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em' } as const

  if (id === 'worthyapply') {
    const n = worthyApply.pipeline.length
    return (
      <svg viewBox="0 0 280 120" className="h-full w-full" aria-hidden="true">
        <line x1="20" x2="260" y1="60" y2="60" stroke="var(--line-strong)" />
        {worthyApply.pipeline.map((s, i) => {
          const x = 20 + (240 / (n - 1)) * i
          const check = s.id === 'factcheck'
          return (
            <g key={s.id}>
              <rect x={x - 5} y={55} width="10" height="10" fill={check ? 'var(--signal)' : 'var(--bg)'} stroke="var(--ink)" />
              <text x={x} y={i % 2 ? 90 : 40} textAnchor="middle" fill="var(--ink-muted)" style={mono}>
                {s.label.split(' ')[0].toUpperCase()}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  if (id === 'eduai') {
    const rows = eduAI.api.flatMap((g) => g.routes.slice(0, 2).map((r) => ({ m: r[0], p: g.base + (r[1] === '/' ? '' : r[1]), jwt: r[2] })))
    return (
      <svg viewBox="0 0 280 120" className="h-full w-full" aria-hidden="true">
        {rows.slice(0, 7).map((r, i) => (
          <g key={i}>
            <text x="16" y={20 + i * 14} fill="var(--measure)" style={mono}>
              {r.m}
            </text>
            <text x="62" y={20 + i * 14} fill="var(--ink)" style={mono}>
              {r.p}
            </text>
            {r.jwt ? (
              <text x="264" y={20 + i * 14} textAnchor="end" fill="var(--ink-muted)" style={mono}>
                JWT
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    )
  }

  if (id === 'agrimind') {
    const xs = [40, 110, 180, 250]
    return (
      <svg viewBox="0 0 280 120" className="h-full w-full" aria-hidden="true">
        <line x1="40" x2="250" y1="60" y2="60" stroke="var(--line-strong)" />
        <path d="M40 60 C 90 100, 150 100, 180 64" fill="none" stroke="var(--measure)" strokeDasharray="3 3" />
        <path d="M110 60 C 130 20, 160 24, 180 56" fill="none" stroke="var(--measure)" strokeDasharray="3 3" />
        {agriMind.graph.map((node, i) => (
          <g key={node.id}>
            <rect x={xs[i] - 6} y="54" width="12" height="12" fill={node.stream === 'merge' ? 'var(--signal)' : 'var(--bg)'} stroke="var(--ink)" />
            <text x={xs[i]} y="88" textAnchor="middle" fill="var(--ink-muted)" style={mono}>
              {node.label.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
    )
  }

  if (id === 'viewly') {
    return (
      <svg viewBox="0 0 280 120" className="h-full w-full" aria-hidden="true">
        {viewly.routes.slice(0, 5).map((r, i) => (
          <g key={r.path}>
            <rect x={14 + i * 52} y="26" width="46" height="62" fill="none" stroke={i === 2 ? 'var(--signal)' : 'var(--line-strong)'} />
            <text x={37 + i * 52} y="104" textAnchor="middle" fill="var(--ink-muted)" style={mono}>
              {r.view.toUpperCase().slice(0, 7)}
            </text>
          </g>
        ))}
      </svg>
    )
  }

  return null
}

/** Responsive <picture> for the dashboard screenshots in /public/work. */
export function Shot({
  name,
  size,
  alt,
  sizes,
  className,
  eager = false,
}: {
  name: string
  size: [number, number]
  alt: string
  sizes: string
  className?: string
  eager?: boolean
}) {
  const set = (ext: string) => [720, 1280, 1920].map((w) => `/work/${name}-${w}.${ext} ${w}w`).join(', ')
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`/work/${name}-1280.webp`}
        width={size[0]}
        height={size[1]}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
