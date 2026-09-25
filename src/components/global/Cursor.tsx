import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { input } from '@/lib/input'
import { damp } from '@/lib/utils'
import { useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery'

type Mode = 'default' | 'link' | 'project' | 'drag' | 'native'

const INTERACTIVE = '[data-cursor], a[href], button, [role="button"], [role="tab"], summary, label[for], input, textarea, select'
const PAD = 6

/**
 * Crosshair cursor with a live coordinate readout. Over links it becomes
 * corner brackets framing the target (a DETECT); project rows show VIEW ↗,
 * draggable areas ← DRAG →, text inputs keep the native cursor.
 * Fine pointers only; off under reduced motion.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  if (!fine || reduced) return null
  return <CursorLayer />
}

function CursorLayer() {
  const cross = useRef<HTMLDivElement | null>(null)
  const label = useRef<HTMLSpanElement | null>(null)
  const readout = useRef<HTMLSpanElement | null>(null)
  const frame = useRef<HTMLDivElement | null>(null)
  const corners = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('has-cursor')

    let mode: Mode = 'default'
    let target: Element | null = null
    const box = { x: 0, y: 0, w: 0, h: 0 }
    let lastText = ''

    const setMode = (next: Mode, el: Element | null) => {
      mode = next
      target = el
      const c = cross.current
      if (!c) return
      c.dataset.mode = next
      if (label.current) label.current.textContent = next === 'project' ? 'VIEW ↗' : next === 'drag' ? '← DRAG →' : ''
    }

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const el = (e.target as Element | null)?.closest(INTERACTIVE) ?? null
      if (!el) return setMode('default', null)
      if (el.matches('input, textarea, select')) return setMode('native', el)
      const kind = (el as HTMLElement).dataset.cursor as Mode | undefined
      setMode(kind === 'project' || kind === 'drag' ? kind : 'link', el)
    }

    const tick = (_t: number, deltaMs: number) => {
      const c = cross.current
      const f = frame.current
      if (!c || !f) return
      const visible = input.active && mode !== 'native'
      c.style.opacity = visible ? '1' : '0'
      c.style.transform = `translate3d(${input.x}px, ${input.y}px, 0)`

      const text = `X ${input.x.toFixed(1).padStart(6, '0')}  Y ${input.y.toFixed(1).padStart(6, '0')}`
      if (text !== lastText && readout.current) {
        lastText = text
        readout.current.textContent = text
      }

      // Brackets: lock onto the target's box in link mode, collapse otherwise.
      const k = damp(22, Math.min(deltaMs, 50) / 1000)
      let tx = input.x - 9
      let ty = input.y - 9
      let tw = 18
      let th = 18
      const locked = mode === 'link' && target && target.isConnected
      if (locked) {
        const r = (target as Element).getBoundingClientRect()
        tx = r.left - PAD
        ty = r.top - PAD
        tw = r.width + PAD * 2
        th = r.height + PAD * 2
      }
      box.x += (tx - box.x) * k
      box.y += (ty - box.y) * k
      box.w += (tw - box.w) * k
      box.h += (th - box.h) * k
      f.style.opacity = locked && visible ? '1' : '0'
      const [tl, tr, bl, br] = corners.current
      if (tl) tl.style.transform = `translate3d(${box.x}px, ${box.y}px, 0)`
      if (tr) tr.style.transform = `translate3d(${box.x + box.w - 8}px, ${box.y}px, 0)`
      if (bl) bl.style.transform = `translate3d(${box.x}px, ${box.y + box.h - 8}px, 0)`
      if (br) br.style.transform = `translate3d(${box.x + box.w - 8}px, ${box.y + box.h - 8}px, 0)`
    }

    document.addEventListener('pointerover', onOver, { passive: true })
    gsap.ticker.add(tick)
    return () => {
      document.removeEventListener('pointerover', onOver)
      gsap.ticker.remove(tick)
      root.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[110]" aria-hidden="true">
      <div ref={frame} className="absolute inset-0 opacity-0 transition-opacity duration-200">
        {['border-l border-t', 'border-r border-t', 'border-b border-l', 'border-b border-r'].map((edges, i) => (
          <span
            key={edges}
            ref={(el) => {
              corners.current[i] = el
            }}
            className={`absolute left-0 top-0 h-2 w-2 border-signal ${edges}`}
          />
        ))}
      </div>

      <div ref={cross} data-mode="default" className="cursor-cross absolute left-0 top-0 opacity-0">
        <span className="cursor-h absolute -left-3 top-0 h-px w-6 bg-signal" />
        <span className="cursor-v absolute -top-3 left-0 h-6 w-px bg-signal" />
        <span className="absolute -left-[2px] -top-[2px] h-[5px] w-[5px] rounded-full bg-signal" />
        <span
          ref={label}
          className="mono mono-sm absolute left-4 top-3 whitespace-nowrap bg-bg px-1.5 py-0.5 signal-sm empty:hidden"
        />
        <span ref={readout} className="cursor-readout mono absolute left-4 top-3 whitespace-nowrap text-[10px] tracking-[0.04em] text-measure" />
      </div>
    </div>
  )
}
