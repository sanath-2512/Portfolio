export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor
}

/** Frame-rate independent smoothing factor for a lerp. */
export function damp(lambda: number, dtSeconds: number) {
  return 1 - Math.exp(-lambda * dtSeconds)
}

const mq = (query: string) => typeof window !== 'undefined' && window.matchMedia(query).matches

export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)')
export const isFinePointer = () => mq('(pointer: fine)')
export const isCoarsePointer = () => mq('(pointer: coarse)')

/** Coarse pointer on a 4-core-or-less device: the field is skipped. */
export function isLowEndDevice() {
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency ?? 8 : 8
  return isCoarsePointer() && cores <= 4
}

let webglSupport: boolean | null = null
let softwareGL = false

/**
 * One-time WebGL probe; the context is released immediately. Software
 * rasterisers (SwiftShader, llvmpipe, Microsoft Basic Render) are treated as
 * unsupported: they run the field on the CPU and block the main thread.
 */
export function supportsWebGL() {
  if (webglSupport !== null) return webglSupport
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') ?? canvas.getContext('webgl')) as WebGLRenderingContext | null
    if (gl) {
      const info = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? '')
      softwareGL = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)
    }
    webglSupport = Boolean(gl) && !softwareGL
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webglSupport = false
  }
  return webglSupport
}

/** Joins class names, skipping falsy entries. */
export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}
