import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from '@/lib/gsap'

/**
 * Breakpoint-aware GSAP setup. Everything registered inside a matchMedia
 * branch is reverted automatically when the branch stops matching or the
 * component unmounts.
 */
export function useGsapMatchMedia(
  scope: RefObject<HTMLElement | null>,
  setup: (mm: gsap.MatchMedia) => void,
) {
  useLayoutEffect(() => {
    if (!scope.current) return
    const mm = gsap.matchMedia(scope.current)
    setup(mm)
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
