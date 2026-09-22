import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/motion'
import { buildGraph } from '@/components/three/graph'
import { clamp, lerp, prefersReducedMotion } from '@/lib/utils'

const INK = 0x08080a
const ACCENT = 0xd7a13b
const DATA = 0x6f6d68

const MOTES_DESKTOP = 160
const MOTES_MOBILE = 80

/**
 * The fixed WebGL backdrop: a sparse retrieval graph that assembles on load,
 * is dollied through while the hero scrolls, recedes as About begins, and
 * returns — wider and slower — behind the contact section.
 *
 * One render loop (gsap.ticker, shared with Lenis). Rendering is skipped
 * whenever the layer is invisible, offscreen, or the tab is hidden.
 */
export default function GraphScene({ onReady }: { onReady?: () => void }) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const readyRef = useRef(onReady)
  readyRef.current = onReady

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const mobile = window.matchMedia('(max-width: 767px)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduced = prefersReducedMotion()

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: 'high-performance' })
    } catch {
      // No WebGL — the poster underneath stays visible.
      return
    }

    const width = window.innerWidth
    const height = window.innerHeight

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2))
    renderer.setSize(width, height)
    renderer.setClearColor(INK, 0)
    const canvas = renderer.domElement
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    host.appendChild(canvas)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(INK, 10, 30)

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60)
    camera.position.set(0, 0, 7)

    const world = new THREE.Group()
    scene.add(world)

    /* ---------------- nodes: one instanced mesh, no lights ------------- */

    const graph = buildGraph(mobile)
    const nodeGeometry = new THREE.OctahedronGeometry(1, 0)
    const nodeMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9 })
    const nodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, graph.nodeCount)
    nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    nodes.frustumCulled = false

    const accentColor = new THREE.Color(ACCENT)
    const dataColor = new THREE.Color(DATA)
    for (let i = 0; i < graph.nodeCount; i += 1) {
      nodes.setColorAt(i, graph.kinds[i] === 1 ? accentColor : dataColor)
    }
    if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true
    world.add(nodes)

    /* ---------------- edges: one LineSegments ------------------------- */

    const edgeGeometry = new THREE.BufferGeometry()
    edgeGeometry.setAttribute('position', new THREE.BufferAttribute(graph.edgePositions, 3))
    const edgeMaterial = new THREE.LineBasicMaterial({ color: DATA, transparent: true, opacity: 0 })
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial)
    edges.frustumCulled = false
    world.add(edges)

    /* ---------------- motes: data travelling along the edges ---------- */

    const moteCount = mobile ? MOTES_MOBILE : MOTES_DESKTOP
    const motePositions = new Float32Array(moteCount * 3)
    const moteEdge = new Uint16Array(moteCount)
    const moteT = new Float32Array(moteCount)
    const moteSpeed = new Float32Array(moteCount)

    for (let i = 0; i < moteCount; i += 1) {
      moteEdge[i] = Math.floor(Math.random() * graph.edgeCount)
      moteT[i] = Math.random()
      moteSpeed[i] = 0.1 + Math.random() * 0.2
    }

    const moteGeometry = new THREE.BufferGeometry()
    moteGeometry.setAttribute('position', new THREE.BufferAttribute(motePositions, 3))
    const moteMaterial = new THREE.PointsMaterial({
      color: ACCENT,
      size: mobile ? 0.06 : 0.048,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const motes = new THREE.Points(moteGeometry, moteMaterial)
    motes.frustumCulled = false
    world.add(motes)

    /* ---------------- scroll-driven state ----------------------------- */

    const state = { assemble: 0, hero: 0, calm: 0 }
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const matrix = new THREE.Matrix4()
    const quaternion = new THREE.Quaternion()
    const scaleVec = new THREE.Vector3()
    const positionVec = new THREE.Vector3()

    const writeNodeMatrices = (assemble: number) => {
      for (let i = 0; i < graph.nodeCount; i += 1) {
        positionVec.set(graph.positions[i * 3], graph.positions[i * 3 + 1], graph.positions[i * 3 + 2])
        const s = graph.radii[i] * assemble
        scaleVec.set(s, s, s)
        matrix.compose(positionVec, quaternion, scaleVec)
        nodes.setMatrixAt(i, matrix)
      }
      nodes.instanceMatrix.needsUpdate = true
    }
    writeNodeMatrices(0)

    const ctx = gsap.context(() => {
      gsap.to(state, {
        assemble: 1,
        duration: reduced ? 0.01 : DUR.long * 1.4,
        delay: reduced ? 0 : 0.2,
        ease: EASE,
      })

      const hero = document.getElementById('home')
      if (hero && !reduced) {
        gsap.to(state, {
          hero: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })
      }

      const contact = document.getElementById('contact')
      if (contact && !reduced) {
        gsap.to(state, {
          calm: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: contact,
            start: 'top bottom',
            end: 'top 35%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
      }
    })

    /* ---------------- render loop ------------------------------------- */

    let visible = true
    let onscreen = true
    let hasRendered = false
    let lastAssemble = -1
    let currentOpacity = -1
    let spin = 0

    const render = (_time: number, deltaMs: number) => {
      const delta = Math.min(deltaMs, 50) / 1000

      const heroFade = clamp(1 - (state.hero - 0.55) / 0.45, 0, 1)
      const opacity = Math.max(heroFade, state.calm * 0.34)

      if (opacity !== currentOpacity) {
        currentOpacity = opacity
        host.style.opacity = opacity.toFixed(3)
        host.style.visibility = opacity < 0.01 ? 'hidden' : 'visible'
      }
      if (!visible || !onscreen || opacity < 0.01) return

      if (state.assemble !== lastAssemble) {
        lastAssemble = state.assemble
        writeNodeMatrices(state.assemble)
        edgeMaterial.opacity = 0.14 * state.assemble
        moteMaterial.opacity = 0.8 * state.assemble
      }

      // Camera: dolly through the graph on the hero, pull back out for the
      // calm reprise behind the contact section.
      // Calm reprise: pull the camera back out past the entrance, so the
      // graph reads small and quiet instead of repeating the hero framing.
      const travel = state.calm > 0.001 ? lerp(1, -0.28, state.calm) : state.hero
      camera.position.z = lerp(7, -10.5, travel)
      camera.position.y = lerp(0, 1.1, travel) - pointer.y * 0.35
      camera.position.x = pointer.x * 0.45
      camera.lookAt(0, 0, camera.position.z - 6)

      pointer.x = lerp(pointer.x, pointer.tx, 0.045)
      pointer.y = lerp(pointer.y, pointer.ty, 0.045)

      spin += delta * 0.02 * (1 - state.calm * 0.7)
      world.rotation.y = Math.sin(spin) * 0.14
      world.rotation.x = Math.cos(spin * 0.7) * 0.045

      // Motes advance along their edge, then respawn on another.
      const speedScale = 1 - state.calm * 0.6
      for (let i = 0; i < moteCount; i += 1) {
        moteT[i] += moteSpeed[i] * delta * speedScale
        if (moteT[i] >= 1) {
          moteT[i] -= 1
          moteEdge[i] = Math.floor(Math.random() * graph.edgeCount)
        }
        const e = moteEdge[i] * 6
        const t = moteT[i]
        motePositions[i * 3] = lerp(graph.edgePositions[e], graph.edgePositions[e + 3], t)
        motePositions[i * 3 + 1] = lerp(graph.edgePositions[e + 1], graph.edgePositions[e + 4], t)
        motePositions[i * 3 + 2] = lerp(graph.edgePositions[e + 2], graph.edgePositions[e + 5], t)
      }
      moteGeometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)

      if (!hasRendered) {
        hasRendered = true
        readyRef.current?.()
      }
    }

    gsap.ticker.add(render)

    /* ---------------- listeners --------------------------------------- */

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        const w = window.innerWidth
        const h = window.innerHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2))
        renderer.setSize(w, h)
        ScrollTrigger.refresh()
      }, 150)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (event.clientY / window.innerHeight) * 2 - 1
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry.isIntersecting
      },
      { threshold: 0 },
    )
    observer.observe(host)

    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    if (finePointer && !reduced) window.addEventListener('pointermove', onPointerMove, { passive: true })

    /* ---------------- teardown ---------------------------------------- */

    return () => {
      gsap.ticker.remove(render)
      ctx.revert()
      observer.disconnect()
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointerMove)

      nodeGeometry.dispose()
      nodeMaterial.dispose()
      nodes.dispose()
      edgeGeometry.dispose()
      edgeMaterial.dispose()
      moteGeometry.dispose()
      moteMaterial.dispose()
      scene.clear()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    }
  }, [])

  return <div ref={hostRef} className="absolute inset-0" style={{ opacity: 0 }} aria-hidden="true" />
}
