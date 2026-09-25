import { useEffect, useRef, useState } from 'react'
import { FieldFallback } from '@/components/field/FieldFallback'
import type { FieldHandle } from '@/components/field/scene'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { isLowEndDevice, supportsWebGL } from '@/lib/utils'

/**
 * Fixed layer behind every section. three.js is imported only after the
 * first paint (the hero heading is the LCP element, not the canvas); until
 * then, and when WebGL is skipped, the page sits on its own background or
 * the static fallback grid.
 */
export function CalibrationField() {
  const host = useRef<HTMLDivElement | null>(null)
  const beam = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    if (reduced || !supportsWebGL() || isLowEndDevice()) {
      setFallback(true)
      return
    }
    setFallback(false)

    let cancelled = false
    let handle: FieldHandle | null = null
    let cancelIdle = () => {}

    const start = () => {
      import('@/components/field/scene')
        .then(({ createField }) => {
          if (cancelled || !host.current) return
          handle = createField(host.current, beam.current)
          if (!handle) setFallback(true)
        })
        .catch(() => setFallback(true))
    }

    const frame = requestAnimationFrame(() => {
      if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(start, { timeout: 500 })
        cancelIdle = () => window.cancelIdleCallback(id)
      } else {
        const id = window.setTimeout(start, 60)
        cancelIdle = () => window.clearTimeout(id)
      }
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      cancelIdle()
      handle?.dispose()
      handle = null
    }
  }, [reduced])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {fallback ? <FieldFallback /> : <div ref={host} className="absolute inset-0" />}
      <div ref={beam} className="absolute inset-y-0 left-0 w-px bg-measure opacity-0" />
    </div>
  )
}
