import { useLayoutEffect, type DependencyList } from 'react'
import { gsap } from '@/lib/gsap'

export function useGSAP(setup: () => void, deps: DependencyList = []) {
  useLayoutEffect(() => {
    const context = gsap.context(setup)
    return () => context.revert()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
