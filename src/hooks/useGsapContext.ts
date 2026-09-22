import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from '@/lib/gsap'

/**
 * Runs GSAP setup scoped to a section root and reverts every tween and
 * trigger it created on unmount.
 */
export function useGsapContext(scope: RefObject<HTMLElement | null>, setup: () => void) {
  useLayoutEffect(() => {
    if (!scope.current) return
    const ctx = gsap.context(setup, scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
