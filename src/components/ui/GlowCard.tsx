import { useRef, useState } from 'react'
import type { HTMLAttributes } from 'react'

interface GlowCardProps extends HTMLAttributes<HTMLDivElement> {
  accentColor?: string
}

export function GlowCard({ children, accentColor = '#00d9ff', style, ...props }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0, active: false })

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true })
  }

  return (
    <div ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos(p => ({ ...p, active: false }))}
      style={{
        position:'relative', overflow:'hidden',
        background: 'var(--color-bg-glass)',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        backdropFilter: 'blur(12px)',
        boxShadow: 'var(--shadow-premium)',
        transition: 'transform 320ms var(--ease-premium), box-shadow 320ms var(--ease-premium), border-color 280ms var(--ease-premium)',
        ...style,
      }}
      {...props}
    >
      {/* Mouse spotlight */}
      {pos.active && (
        <div style={{
          position:'absolute', pointerEvents:'none', zIndex:0,
          width:300, height:300, borderRadius:'50%',
          left: pos.x - 150, top: pos.y - 150,
          background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`,
          transition: 'opacity 0.2s',
        }} />
      )}
      <div style={{ position:'relative', zIndex:1 }}>{children}</div>
    </div>
  )
}
