import * as THREE from 'three'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { input } from '@/lib/input'
import { THEME_EVENT, getTheme } from '@/lib/theme'
import { clamp, damp, lerp } from '@/lib/utils'
import { fragmentShader, vertexShader } from '@/components/field/shaders'

/**
 * The Calibration Field: one fixed canvas, one instanced mesh, every frame
 * driven by uniforms. Page scroll maps to uCalibration through the
 * `data-cal` stops on each section; `data-field` regions add the per-section
 * nudges (chunks, lanes, furrows, dim).
 */

type NudgeKind = 'chunks' | 'lanes' | 'furrows' | 'dim'

interface Stop {
  y: number
  cal: number
}

interface Nudge {
  kind: NudgeKind
  top: number
  bottom: number
}

export interface FieldHandle {
  dispose(): void
}

const FOV = 32
const CAMERA_Z = 12
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

export function createField(host: HTMLElement, beam: HTMLElement | null): FieldHandle | null {
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const mobile = coarse || window.innerWidth < 768
  const tablet = !mobile && window.innerWidth < 1200
  const cellTarget = mobile ? 2500 : tablet ? 4200 : 8400

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: 'high-performance' })
  } catch {
    return null
  }

  const pixelRatio = () => Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5)
  renderer.setPixelRatio(pixelRatio())
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)
  const canvas = renderer.domElement
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.setAttribute('aria-hidden', 'true')
  host.appendChild(canvas)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 80)
  camera.position.set(0, 0, CAMERA_Z)

  /* ---------------- material ---------------- */

  const uniforms = {
    uPlane: { value: new THREE.Matrix4() },
    uGrid: { value: new THREE.Vector2(1, 1) },
    uSpacing: { value: 0.1 },
    uCellSize: { value: 0.03 },
    uTime: { value: 0 },
    uCal: { value: 0 },
    uBoost: { value: 0 },
    uChunk: { value: 0 },
    uLanes: { value: 0 },
    uFurrow: { value: 0 },
    uLens: { value: new THREE.Vector3(0, 0, 0) },
    uLensRadius: { value: 1 },
    uScan: { value: -2 },
    uScanOn: { value: 0 },
    uReveal: { value: -1.4 },
    uInk: { value: new THREE.Color() },
    uMeasure: { value: new THREE.Color() },
    uAlpha: { value: 0.3 },
    uOpacity: { value: 1 },
  }

  const material = new THREE.RawShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  })

  const readTheme = () => {
    const styles = getComputedStyle(document.documentElement)
    uniforms.uInk.value.set(styles.getPropertyValue('--ink').trim() || '#ece6d6')
    uniforms.uMeasure.value.set(styles.getPropertyValue('--measure').trim() || '#d7f25c')
    const paper = getTheme() === 'paper'
    // Darkroom: soft additive light. Paper: ink squares, normal blending.
    material.blending = paper ? THREE.NormalBlending : THREE.AdditiveBlending
    uniforms.uAlpha.value = paper ? 0.17 : 0.22
    material.needsUpdate = true
  }
  readTheme()

  /* ---------------- geometry ---------------- */

  const quad = new THREE.PlaneGeometry(1, 1)
  let geometry: THREE.InstancedBufferGeometry | null = null
  let gridAspect = 0

  const buildGeometry = (aspect: number) => {
    geometry?.dispose()
    const rows = Math.max(12, Math.round(Math.sqrt(cellTarget / aspect)))
    const cols = Math.max(12, Math.round(cellTarget / rows))
    const count = cols * rows
    const cells = new Float32Array(count * 4)

    // Deterministic PRNG so the board, and its fiducials, are identical on reload.
    let seed = 20260925
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 0x100000000
    }

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const i = (r * cols + c) * 4
        cells[i] = (c / (cols - 1)) * 2 - 1
        cells[i + 1] = (r / (rows - 1)) * 2 - 1
        cells[i + 2] = random()
        cells[i + 3] = random()
      }
    }

    const g = new THREE.InstancedBufferGeometry()
    g.index = quad.index
    g.setAttribute('position', quad.getAttribute('position'))
    g.setAttribute('uv', quad.getAttribute('uv'))
    g.setAttribute('aCell', new THREE.InstancedBufferAttribute(cells, 4))
    g.instanceCount = count
    uniforms.uGrid.value.set(cols, rows)
    geometry = g
    gridAspect = aspect
    return g
  }

  const mesh = new THREE.Mesh(buildGeometry(window.innerWidth / window.innerHeight), material)
  mesh.frustumCulled = false
  scene.add(mesh)

  /* ---------------- layout ---------------- */

  let vw = window.innerWidth
  let vh = window.innerHeight

  const layout = () => {
    vw = window.innerWidth
    vh = window.innerHeight
    const aspect = vw / vh
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(pixelRatio())
    renderer.setSize(vw, vh)

    if (Math.abs(aspect - gridAspect) / gridAspect > 0.25) mesh.geometry = buildGeometry(aspect)

    const visH = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const visW = visH * aspect
    const { x: cols, y: rows } = uniforms.uGrid.value
    const spacing = Math.max((visW * 1.06) / (cols - 1), (visH * 1.06) / (rows - 1))
    uniforms.uSpacing.value = spacing
    uniforms.uCellSize.value = spacing * 0.3
    uniforms.uLensRadius.value = spacing * (mobile ? 5 : 7.5)
  }
  layout()

  /* ---------------- scroll mapping ---------------- */

  let stops: Stop[] = [{ y: 0, cal: 0 }]
  let nudges: Nudge[] = []
  let contactY = Infinity

  const measureStops = () => {
    const sy = window.scrollY
    const maxCentre = document.documentElement.scrollHeight - vh / 2
    const next: Stop[] = []
    document.querySelectorAll<HTMLElement>('[data-cal]').forEach((el) => {
      const rect = el.getBoundingClientRect()
      const top = rect.top + sy
      const cal = Number(el.dataset.cal)
      const end = el.dataset.calEnd !== undefined ? Number(el.dataset.calEnd) : null
      if (end === null) {
        next.push({ y: Math.min(top + rect.height / 2, maxCentre - 1), cal })
      } else {
        next.push({ y: top + rect.height * 0.2, cal })
        next.push({ y: top + rect.height * 0.8, cal: end })
      }
      if (el.id === 'contact') contactY = top + Math.min(rect.height * 0.3, vh * 0.3)
    })
    stops = next.sort((a, b) => a.y - b.y)

    nudges = []
    document.querySelectorAll<HTMLElement>('[data-field]').forEach((el) => {
      const rect = el.getBoundingClientRect()
      nudges.push({ kind: el.dataset.field as NudgeKind, top: rect.top + sy, bottom: rect.bottom + sy })
    })
  }

  const sampleCal = (centre: number) => {
    if (stops.length === 0) return 0
    if (centre <= stops[0].y) return stops[0].cal
    for (let i = 0; i < stops.length - 1; i += 1) {
      const a = stops[i]
      const b = stops[i + 1]
      if (centre <= b.y) return lerp(a.cal, b.cal, (centre - a.y) / Math.max(1, b.y - a.y))
    }
    return stops[stops.length - 1].cal
  }

  const target: Record<NudgeKind, number> = { chunks: 0, lanes: 0, furrows: 0, dim: 0 }
  const sampleNudges = (centre: number) => {
    target.chunks = target.lanes = target.furrows = target.dim = 0
    for (const n of nudges) {
      const p = (centre - n.top) / Math.max(1, n.bottom - n.top)
      if (p <= 0 || p >= 1) continue
      // Chunks split and rejoin; the rest hold while their region is in view.
      const v = n.kind === 'chunks' ? Math.sin(Math.PI * p) : smooth(0, 0.12, p) * (1 - smooth(0.88, 1, p))
      target[n.kind] = Math.max(target[n.kind], v)
    }
  }

  measureStops()
  ScrollTrigger.addEventListener('refresh', measureStops)

  /* ---------------- scans: intro and contact ---------------- */

  const scanState = { x: -1.3, on: 0 }
  const syncBeam = () => {
    uniforms.uScan.value = scanState.x
    uniforms.uScanOn.value = scanState.on
    if (beam) {
      beam.style.opacity = String(scanState.on)
      beam.style.transform = `translate3d(${((scanState.x + 1) / 2) * vw}px,0,0)`
    }
  }

  const sweep = (reveal: boolean) =>
    gsap
      .timeline({ onUpdate: syncBeam, onComplete: syncBeam })
      .set(scanState, { x: -1.3, on: 1 })
      .to(scanState, {
        x: 1.3,
        duration: 1.05,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (reveal) uniforms.uReveal.value = scanState.x
        },
      })
      .to(scanState, { on: 0, duration: 0.15 }, '-=0.15')

  const intro = sweep(true).eventCallback('onComplete', () => {
    uniforms.uReveal.value = 2
    syncBeam()
  })
  let contactScanned = false
  let contactTween: gsap.core.Timeline | null = null

  /* ---------------- frame loop ---------------- */

  const current = { cal: 0, chunks: 0, lanes: 0, furrows: 0, dim: 0, boost: 0, lens: 0 }
  const camTarget = new THREE.Vector2()
  const planeMatrix = uniforms.uPlane.value
  const inverse = new THREE.Matrix4()
  const mT = new THREE.Matrix4()
  const mRx = new THREE.Matrix4()
  const mRy = new THREE.Matrix4()
  const mS = new THREE.Matrix4()
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const origin = new THREE.Vector3()
  const direction = new THREE.Vector3()

  let visible = document.visibilityState === 'visible'
  let fine = window.matchMedia('(pointer: fine)').matches

  const render = (_t: number, deltaMs: number) => {
    if (!visible) return
    const dt = Math.min(deltaMs, 50) / 1000

    const centre = window.scrollY + vh / 2
    sampleNudges(centre)
    const k = damp(4.5, dt)
    current.cal += (sampleCal(centre) - current.cal) * k
    current.chunks += (target.chunks - current.chunks) * k
    current.lanes += (target.lanes - current.lanes) * k
    current.furrows += (target.furrows - current.furrows) * k
    current.dim += (target.dim - current.dim) * k
    current.boost += (clamp(Math.abs(input.velocity) / 2800, 0, 1) * 0.35 - current.boost) * damp(6, dt)

    // Contact: one last scan over the finished grid.
    if (!contactScanned && centre > contactY) {
      contactScanned = true
      contactTween?.kill()
      contactTween = sweep(false)
    } else if (contactScanned && centre < contactY - vh) {
      contactScanned = false
    }

    // Between the hero and the contact grid the field steps back behind text;
    // it's full strength only where it is the subject.
    const quiet = smooth(0.06, 0.18, current.cal) * (1 - smooth(0.9, 0.99, current.cal))
    const opacity = lerp(1, 0.5, quiet) * lerp(1, 0.55, current.dim)
    uniforms.uOpacity.value = opacity
    if (opacity < 0.01) return

    const cal = current.cal
    const settle = smooth(0, 0.42, cal)
    const spread = lerp(1.55, 1, smooth(0, 0.5, cal))
    const tilt = -1.02 * (1 - settle) - 0.3 * current.furrows
    const yaw = 0.2 * (1 - settle)
    const yShift = lerp(-0.85, 0, settle)
    const zShift = -2.2 * current.dim

    mS.makeScale(spread, spread, 1)
    mRy.makeRotationY(yaw)
    mRx.makeRotationX(tilt)
    mT.makeTranslation(0, yShift, zShift)
    planeMatrix.copy(mT).multiply(mRx).multiply(mRy).multiply(mS)

    // Camera parallax from the pointer, lerped.
    camTarget.set(input.nx * 0.35, input.ny * 0.22)
    const ck = damp(3, dt)
    camera.position.x += (camTarget.x - camera.position.x) * ck
    camera.position.y += (camTarget.y - camera.position.y) * ck
    camera.lookAt(0, 0, 0)
    camera.updateMatrixWorld()

    // The measuring lens: intersect the pointer ray with the board plane.
    const lensOn = fine && input.active ? 1 : 0
    current.lens += (lensOn - current.lens) * damp(5, dt)
    if (current.lens > 0.001) {
      ndc.set((input.x / vw) * 2 - 1, -(input.y / vh) * 2 + 1)
      ray.setFromCamera(ndc, camera)
      inverse.copy(planeMatrix).invert()
      origin.copy(ray.ray.origin).applyMatrix4(inverse)
      direction.copy(ray.ray.direction).transformDirection(inverse)
      if (Math.abs(direction.z) > 1e-4) {
        const t = -origin.z / direction.z
        const lx = origin.x + direction.x * t
        const ly = origin.y + direction.y * t
        uniforms.uLens.value.set(lx, ly, current.lens)
        const { x: cols, y: rows } = uniforms.uGrid.value
        const c = Math.round(lx / uniforms.uSpacing.value + (cols - 1) / 2)
        const r = Math.round((rows - 1) / 2 - ly / uniforms.uSpacing.value)
        const inside = lensOn && c >= 0 && c < cols && r >= 0 && r < rows
        input.cellC = inside ? c : -1
        input.cellR = inside ? r : -1
      }
    } else {
      uniforms.uLens.value.z = 0
      input.cellC = input.cellR = -1
    }

    uniforms.uTime.value += dt
    uniforms.uCal.value = cal
    uniforms.uBoost.value = current.boost
    uniforms.uChunk.value = current.chunks
    uniforms.uLanes.value = current.lanes
    uniforms.uFurrow.value = current.furrows

    renderer.render(scene, camera)
  }

  gsap.ticker.add(render)

  /* ---------------- listeners ---------------- */

  let resizeTimer = 0
  const onResize = () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      layout()
      measureStops()
    }, 120)
  }
  const onVisibility = () => {
    visible = document.visibilityState === 'visible'
  }
  const pointerQuery = window.matchMedia('(pointer: fine)')
  const onPointerQuery = () => {
    fine = pointerQuery.matches
  }

  window.addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener(THEME_EVENT, readTheme)
  pointerQuery.addEventListener('change', onPointerQuery)

  return {
    dispose() {
      gsap.ticker.remove(render)
      intro.kill()
      contactTween?.kill()
      ScrollTrigger.removeEventListener('refresh', measureStops)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener(THEME_EVENT, readTheme)
      pointerQuery.removeEventListener('change', onPointerQuery)

      scene.remove(mesh)
      geometry?.dispose()
      quad.dispose()
      material.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    },
  }
}
