export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

let webglSupport: boolean | null = null

/** One-time WebGL probe; the context is released immediately. */
export function supportsWebGL() {
  if (webglSupport !== null) return webglSupport
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    webglSupport = Boolean(gl)
    const lose = (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')
    lose?.loseContext()
  } catch {
    webglSupport = false
  }
  return webglSupport
}

/** Joins class names, skipping falsy entries. */
export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}
