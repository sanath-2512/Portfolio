import { gsap } from '@/lib/gsap'
import { clamp, damp } from '@/lib/utils'

/**
 * Pointer and scroll state shared by the field, cursor and hero. Lives
 * outside React: one listener, one ticker callback, plain mutable numbers.
 */
export const input = {
  /** Pointer in CSS px (client space). */
  x: -1,
  y: -1,
  /** Pointer in -1..1, y up. */
  nx: 0,
  ny: 0,
  /** True while a fine pointer is over the document. */
  active: false,
  /** Scroll position and smoothed velocity in px/s. */
  scrollY: 0,
  velocity: 0,
  /** 0..1 over the whole document. */
  progress: 0,
  /** Board cell under the pointer, written by the field (-1 when none). */
  cellC: -1,
  cellR: -1,
}

let started = 0
let stop: (() => void) | null = null

export function startInput(): () => void {
  started += 1
  if (started > 1) return release

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
    input.x = e.clientX
    input.y = e.clientY
    input.nx = (e.clientX / window.innerWidth) * 2 - 1
    input.ny = -((e.clientY / window.innerHeight) * 2 - 1)
    input.active = true
  }
  const onLeave = () => {
    input.active = false
  }

  let lastY = window.scrollY
  let max = 1
  const measureMax = () => {
    max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  }
  measureMax()

  const tick = (_t: number, deltaMs: number) => {
    const dt = Math.max(deltaMs, 1) / 1000
    const y = window.scrollY
    const raw = (y - lastY) / dt
    lastY = y
    input.scrollY = y
    input.velocity += (clamp(raw, -6000, 6000) - input.velocity) * damp(10, dt)
    input.progress = clamp(y / max, 0, 1)
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
  window.addEventListener('resize', measureMax)
  const ro = new ResizeObserver(measureMax)
  ro.observe(document.body)
  gsap.ticker.add(tick)

  stop = () => {
    window.removeEventListener('pointermove', onMove)
    document.documentElement.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('resize', measureMax)
    ro.disconnect()
    gsap.ticker.remove(tick)
  }
  return release
}

function release() {
  started -= 1
  if (started === 0 && stop) {
    stop()
    stop = null
  }
}
