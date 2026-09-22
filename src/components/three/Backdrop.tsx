import { lazy, Suspense, useEffect, useState } from 'react'
import { ScenePoster } from '@/components/three/ScenePoster'
import { cx, prefersReducedMotion, supportsWebGL } from '@/lib/utils'

const GraphScene = lazy(() => import('@/components/three/GraphScene'))

/**
 * Fixed layer behind the page. The poster paints immediately so the hero
 * never sits on empty black; the WebGL scene is only requested after the
 * first frame, and the poster fades out once it has drawn.
 */
export function Backdrop() {
  const [mountScene, setMountScene] = useState(false)
  const [sceneLive, setSceneLive] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion() || !supportsWebGL()) return

    let cancel = () => {}
    const frame = requestAnimationFrame(() => {
      const start = () => setMountScene(true)
      if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(start, { timeout: 600 })
        cancel = () => window.cancelIdleCallback(id)
      } else {
        const id = window.setTimeout(start, 120)
        cancel = () => window.clearTimeout(id)
      }
    })

    return () => {
      cancelAnimationFrame(frame)
      cancel()
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className={cx(
          'absolute inset-0 transition-opacity duration-700',
          sceneLive ? 'opacity-0' : 'opacity-40',
        )}
        style={{ transitionTimingFunction: 'var(--ease-out)' }}
      >
        <ScenePoster />
      </div>

      {mountScene ? (
        <Suspense fallback={null}>
          <GraphScene onReady={() => setSceneLive(true)} />
        </Suspense>
      ) : null}
    </div>
  )
}
