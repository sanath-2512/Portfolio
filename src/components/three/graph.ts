import * as THREE from 'three'

/**
 * Builds the retrieval-pipeline graph: scattered data nodes at the front
 * converging, stage by stage, into a single processing node at the back.
 * Geometry is generated once and handed to the scene as flat buffers.
 */

export interface GraphData {
  /** Node centres, in draw order. */
  positions: Float32Array
  /** Per-node radius. */
  radii: Float32Array
  /** 0 = data point, 1 = processing node. */
  kinds: Uint8Array
  /** Flat [ax,ay,az, bx,by,bz, ...] pairs for LineSegments. */
  edgePositions: Float32Array
  /** Per-mote source and target node indices. */
  edgeIndices: Uint16Array
  edgeCount: number
  nodeCount: number
}

const DESKTOP_STAGES = [10, 7, 5, 3, 2, 1]
const MOBILE_STAGES = [6, 5, 4, 3, 2, 1]

/** Stage ring radius — wide at the front, tightening toward the output. */
const RADII = [3.0, 2.4, 1.72, 1.1, 0.62, 0]
const STAGE_GAP = 2.7
const FIRST_Z = -0.8

/** Deterministic PRNG so the graph is identical across reloads. */
function makeRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0x100000000
  }
}

export function buildGraph(mobile: boolean): GraphData {
  const stages = mobile ? MOBILE_STAGES : DESKTOP_STAGES
  const random = makeRandom(20260922)

  const points: THREE.Vector3[] = []
  const radii: number[] = []
  const kinds: number[] = []
  const stageRanges: Array<[number, number]> = []

  stages.forEach((count, stage) => {
    const start = points.length
    const z = FIRST_Z - stage * STAGE_GAP
    const ringRadius = RADII[stage]
    const offset = random() * Math.PI * 2

    for (let i = 0; i < count; i += 1) {
      const angle = offset + (i / count) * Math.PI * 2 + (random() - 0.5) * 0.5
      const jitter = 1 + (random() - 0.5) * 0.28
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * ringRadius * jitter,
          Math.sin(angle) * ringRadius * jitter * 0.62,
          z + (random() - 0.5) * 0.9,
        ),
      )
      // Front stages are the documents flowing in; back stages process them.
      const processing = stage >= 3
      kinds.push(processing ? 1 : 0)
      radii.push(processing ? 0.095 + stage * 0.032 : 0.032 + random() * 0.022)
    }
    stageRanges.push([start, points.length])
  })

  // Sparse forward edges: each node reaches one or two nodes one stage deeper.
  const edges: Array<[number, number]> = []
  for (let stage = 0; stage < stageRanges.length - 1; stage += 1) {
    const [from, to] = stageRanges[stage]
    const [nextFrom, nextTo] = stageRanges[stage + 1]
    const nextCount = nextTo - nextFrom

    for (let i = from; i < to; i += 1) {
      const primary = nextFrom + Math.floor(random() * nextCount)
      edges.push([i, primary])
      if (nextCount > 1 && random() > 0.55) {
        const secondary = nextFrom + ((primary - nextFrom + 1 + Math.floor(random() * (nextCount - 1))) % nextCount)
        edges.push([i, secondary])
      }
    }
  }

  const positions = new Float32Array(points.length * 3)
  points.forEach((p, i) => {
    positions[i * 3] = p.x
    positions[i * 3 + 1] = p.y
    positions[i * 3 + 2] = p.z
  })

  const edgePositions = new Float32Array(edges.length * 6)
  const edgeIndices = new Uint16Array(edges.length * 2)
  edges.forEach(([a, b], i) => {
    edgePositions.set([points[a].x, points[a].y, points[a].z, points[b].x, points[b].y, points[b].z], i * 6)
    edgeIndices[i * 2] = a
    edgeIndices[i * 2 + 1] = b
  })

  return {
    positions,
    radii: new Float32Array(radii),
    kinds: new Uint8Array(kinds),
    edgePositions,
    edgeIndices,
    edgeCount: edges.length,
    nodeCount: points.length,
  }
}
