import { useEffect, useRef, useState } from 'react'
import { lerp } from '@/lib/utils'

export function CustomCursor() {
  const dot = useRef<HTMLDivElement | null>(null)
  const ring = useRef<HTMLDivElement | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse), (max-width: 767px)').matches
    setEnabled(!coarse)
  }, [])

  useEffect(() => {
    if (!enabled) return
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let hovered = false
    let linked = false

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
      if (dot.current) {
        dot.current.style.opacity = '1'
        dot.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`
      }
      if (ring.current) ring.current.style.visibility = 'visible'
    }
    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      hovered = Boolean(target.closest('button, a, input, textarea, [data-cursor="hover"]'))
      linked = Boolean(target.closest('a'))
    }
    const frame = () => {
      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0) scale(${linked ? 2 : hovered ? 1.5 : 1})`
        ring.current.style.opacity = hovered ? '0.5' : '0.28'
        ring.current.style.mixBlendMode = linked ? 'difference' : 'normal'
      }
      requestAnimationFrame(frame)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    const id = requestAnimationFrame(frame)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(id)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[10000] h-1.5 w-1.5 rounded-full bg-brand-cyan opacity-0" />
      <div ref={ring} className="pointer-events-none invisible fixed left-0 top-0 z-[10000] h-10 w-10 rounded-full border border-brand-cyan/70 transition-[opacity,background] duration-200" />
    </>
  )
}
