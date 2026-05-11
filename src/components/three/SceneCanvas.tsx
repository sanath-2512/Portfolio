import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { lerp } from '@/lib/utils'

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const update = () => setMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return mobile
}

export default function SceneCanvas() {
  const host = useRef<HTMLDivElement | null>(null)
  const mobile = useIsMobile()

  useEffect(() => {
    if (mobile || !host.current) return
    const el = host.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 100)
    camera.position.z = 7.5
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.domElement.style.pointerEvents = 'none'
    el.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)
    scene.add(new THREE.AmbientLight('#ffffff', 0.35))
    const point = new THREE.PointLight('#00d9ff', 3, 20)
    point.position.set(4, 4, 4)
    scene.add(point)

    const nodes = Array.from({ length: 46 }, () => ({
      base: new THREE.Vector3((Math.random() - 0.5) * 8.8, (Math.random() - 0.5) * 4.8, (Math.random() - 0.5) * 4.2),
      phase: Math.random() * Math.PI * 2,
      radius: 0.025 + Math.random() * 0.045,
    }))
    const material = new THREE.MeshStandardMaterial({ color: '#041d24', emissive: '#00d9ff', emissiveIntensity: 0.75, transparent: true, opacity: 0.72, roughness: 0.25 })
    nodes.forEach((node) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(node.radius, 16, 16), material)
      mesh.position.copy(node.base)
      group.add(mesh)
    })

    const linePositions: number[] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].base.distanceTo(nodes[j].base) < 1.15 && linePositions.length < 540) {
          linePositions.push(...nodes[i].base.toArray(), ...nodes[j].base.toArray())
        }
      }
    }
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    group.add(new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: '#00d9ff', transparent: true, opacity: 0.09 })))

    const particlePositions = new Float32Array(900 * 3)
    for (let i = 0; i < 900; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    const particles = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(particlePositions, 3)),
      new THREE.PointsMaterial({ color: '#00d9ff', size: 0.014, transparent: true, opacity: 0.2, depthWrite: false }),
    )
    scene.add(particles)

    let mouseX = 0
    let mouseY = 0
    let raf = 0
    const clock = new THREE.Clock()
    const onMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = (event.clientY / window.innerHeight) * 2 - 1
    }
    const onResize = () => {
      if (!host.current) return
      camera.aspect = host.current.clientWidth / host.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(host.current.clientWidth, host.current.clientHeight)
    }
    const frame = () => {
      const elapsed = clock.getElapsedTime()
      group.rotation.x = lerp(group.rotation.x, mouseY * 0.25, 0.05)
      group.rotation.y = lerp(group.rotation.y, mouseX * 0.3, 0.05)
      particles.rotation.y += 0.0005
      group.children.forEach((child, index) => {
        const node = nodes[index]
        if (node && child instanceof THREE.Mesh) child.position.y = node.base.y + Math.sin(elapsed * 0.8 + node.phase) * 0.08
      })
      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize', onResize)
    frame()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      material.dispose()
      lineGeometry.dispose()
      particles.geometry.dispose()
      ;(particles.material as THREE.Material).dispose()
      el.replaceChildren()
    }
  }, [mobile])

  if (mobile) {
    return (
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(0,217,255,0.16), transparent 34%), radial-gradient(circle at 25% 70%, rgba(139,92,246,0.15), transparent 30%), #030303',
        }}
      />
    )
  }
  return <div ref={host} className="absolute inset-0 !pointer-events-none" aria-hidden="true" />
}
