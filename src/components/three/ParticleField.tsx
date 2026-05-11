import { Points, PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const data = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      data[i * 3] = (Math.random() - 0.5) * 14
      data[i * 3 + 1] = (Math.random() - 0.5) * 8
      data[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return data
  }, [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.015
      ref.current.rotation.x += delta * 0.006
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial transparent color="#00d9ff" size={0.015} sizeAttenuation depthWrite={false} opacity={0.45} />
    </Points>
  )
}
