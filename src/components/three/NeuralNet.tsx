import { Line, Sphere } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useMousePosition } from '@/hooks/useMousePosition'
import { lerp } from '@/lib/utils'

type NodeData = { position: THREE.Vector3; radius: number; phase: number }

export function NeuralNet() {
  const group = useRef<THREE.Group>(null)
  const mouse = useMousePosition()
  const nodes = useMemo<NodeData[]>(() => {
    return Array.from({ length: 80 }, () => ({
      position: new THREE.Vector3((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4.2, (Math.random() - 0.5) * 4.2),
      radius: 0.035 + Math.random() * 0.08,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])
  const connections = useMemo(() => {
    const edges: { start: THREE.Vector3; end: THREE.Vector3; distance: number }[] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position)
        if (dist < 2.5) {
          edges.push({ start: nodes[i].position, end: nodes[j].position, distance: dist })
        }
      }
    }
    return edges
  }, [nodes])

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouse.x * 0.25, 0.03)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -mouse.y * 0.15, 0.03)
    group.current.children.forEach((child, index) => {
      if (child.type === 'Mesh') child.position.y += Math.sin(clock.elapsedTime * 0.8 + (nodes[index]?.phase ?? 0)) * 0.0008
    })
  })

  return (
    <group ref={group}>
      {connections.map(({ start, end, distance }, index) => (
        <Line key={`edge-${index}`} points={[start, end]} color="#00d9ff" transparent opacity={1 - (distance / 2.5)} lineWidth={0.3} />
      ))}
      {nodes.map((node, index) => (
        <Sphere key={`node-${index}`} args={[node.radius, 16, 16]} position={node.position}>
          <meshStandardMaterial color="#041d24" emissive="#00d9ff" emissiveIntensity={1.2} roughness={0.25} />
        </Sphere>
      ))}
    </group>
  )
}
