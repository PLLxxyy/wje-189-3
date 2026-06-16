import React, { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoadSegment, useStore, TrafficLevel } from '../store'

const trafficColors: Record<TrafficLevel, string> = {
  smooth: '#22c55e',
  slow: '#eab308',
  jam: '#ef4444'
}

const BLOCKED_COLOR = '#6b7280'

function pointOnRoad(road: { start: [number, number, number]; end: [number, number, number] }, point: [number, number, number], eps = 0.5): boolean {
  const r1Horiz = Math.abs(road.start[2] - road.end[2]) < 0.1
  const r1Vert = Math.abs(road.start[0] - road.end[0]) < 0.1

  if (r1Horiz) {
    if (Math.abs(road.start[2] - point[2]) > eps) return false
    const xMin = Math.min(road.start[0], road.end[0]) - eps
    const xMax = Math.max(road.start[0], road.end[0]) + eps
    return point[0] >= xMin && point[0] <= xMax
  }

  if (r1Vert) {
    if (Math.abs(road.start[0] - point[0]) > eps) return false
    const zMin = Math.min(road.start[2], road.end[2]) - eps
    const zMax = Math.max(road.start[2], road.end[2]) + eps
    return point[2] >= zMin && point[2] <= zMax
  }

  return false
}

function getConnectedRoads(currentRoadId: string, direction: 'forward' | 'backward'): string[] {
  const state = useStore.getState()
  const currentRoad = state.data.roads.find(r => r.id === currentRoadId)
  if (!currentRoad) return []

  const targetPoint = direction === 'forward' ? currentRoad.end : currentRoad.start

  const connected: string[] = []
  state.data.roads.forEach(road => {
    if (road.id === currentRoadId || road.blocked) return

    const startMatch = Math.abs(road.start[0] - targetPoint[0]) < 0.5 &&
                       Math.abs(road.start[1] - targetPoint[1]) < 0.5 &&
                       Math.abs(road.start[2] - targetPoint[2]) < 0.5

    const endMatch = Math.abs(road.end[0] - targetPoint[0]) < 0.5 &&
                     Math.abs(road.end[1] - targetPoint[1]) < 0.5 &&
                     Math.abs(road.end[2] - targetPoint[2]) < 0.5

    const onRoad = pointOnRoad(road, targetPoint)

    if (startMatch || endMatch || onRoad) {
      connected.push(road.id)
    }
  })

  return connected
}

function CarOnRoad({ road, index, total }: { road: RoadSegment; index: number; total: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const offset = index / total
  const [currentRoadId, setCurrentRoadId] = useState(road.id)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [route, setRoute] = useState<string[]>([])
  const [routeIndex, setRouteIndex] = useState(0)

  useFrame((_, delta) => {
    if (!ref.current) return
    const state = useStore.getState()

    let currentRoad = state.data.roads.find(r => r.id === currentRoadId)
    if (!currentRoad) {
      currentRoad = road
    }

    if (currentRoad.blocked) {
      const alternatives = getConnectedRoads(currentRoad.id, direction)
      if (alternatives.length > 0) {
        const nextRoadId = alternatives[Math.floor(Math.random() * alternatives.length)]
        const nextRoad = state.data.roads.find(r => r.id === nextRoadId)
        if (nextRoad) {
          setCurrentRoadId(nextRoadId)
          setDirection(Math.random() > 0.5 ? 'forward' : 'backward')
          ref.current.userData.progress = 0
          return
        }
      }
      return
    }

    const speedFactor = Math.max(0.1, currentRoad.speed / 60)
    const timeSpeed = state.timeSpeed
    const moveSpeed = delta * speedFactor * timeSpeed * 0.05

    let progress = ref.current.userData.progress ?? offset

    if (progress >= 0.95) {
      const nextRoads = getConnectedRoads(currentRoad.id, direction)

      if (nextRoads.length > 0) {
        let nextRoadId = nextRoads[Math.floor(Math.random() * nextRoads.length)]

        const pathResult = state.findShortestPath(currentRoad.id, nextRoadId)
        if (pathResult && pathResult.path.length > 1) {
          setRoute(pathResult.path)
          setRouteIndex(1)
          nextRoadId = pathResult.path[1]
        }

        const nextRoad = state.data.roads.find(r => r.id === nextRoadId)
        if (nextRoad && !nextRoad.blocked) {
          const currentEnd = direction === 'forward' ? currentRoad.end : currentRoad.start
          const nextStartsAtStart = Math.abs(nextRoad.start[0] - currentEnd[0]) < 0.1 &&
                                    Math.abs(nextRoad.start[1] - currentEnd[1]) < 0.1 &&
                                    Math.abs(nextRoad.start[2] - currentEnd[2]) < 0.1

          setCurrentRoadId(nextRoadId)
          setDirection(nextStartsAtStart ? 'forward' : 'backward')
          ref.current.userData.progress = 0
          return
        }
      }

      if (route.length > 0 && routeIndex < route.length) {
        const nextRoadId = route[routeIndex]
        const nextRoad = state.data.roads.find(r => r.id === nextRoadId)
        if (nextRoad && !nextRoad.blocked) {
          const currentEnd = direction === 'forward' ? currentRoad.end : currentRoad.start
          const nextStartsAtStart = Math.abs(nextRoad.start[0] - currentEnd[0]) < 0.1 &&
                                    Math.abs(nextRoad.start[1] - currentEnd[1]) < 0.1 &&
                                    Math.abs(nextRoad.start[2] - currentEnd[2]) < 0.1

          setCurrentRoadId(nextRoadId)
          setDirection(nextStartsAtStart ? 'forward' : 'backward')
          setRouteIndex(routeIndex + 1)
          ref.current.userData.progress = 0
          return
        }
      }

      setDirection(direction === 'forward' ? 'backward' : 'forward')
      ref.current.userData.progress = 0.05
      return
    }

    progress = Math.min(1, progress + moveSpeed)
    ref.current.userData.progress = progress

    const t = direction === 'forward' ? progress : 1 - progress
    const displayRoad = state.data.roads.find(r => r.id === currentRoadId) || road
    const sx = displayRoad.start[0] + (displayRoad.end[0] - displayRoad.start[0]) * t
    const sy = displayRoad.start[1] + (displayRoad.end[1] - displayRoad.start[1]) * t + 0.4
    const sz = displayRoad.start[2] + (displayRoad.end[2] - displayRoad.start[2]) * t

    const dx = displayRoad.end[0] - displayRoad.start[0]
    const dz = displayRoad.end[2] - displayRoad.start[2]
    const len = Math.sqrt(dx * dx + dz * dz)
    const perpX = -dz / len
    const perpZ = dx / len
    const laneOffset = ((index % 3) - 1) * 0.8

    ref.current.position.set(sx + perpX * laneOffset, sy, sz + perpZ * laneOffset)

    const moveDir = direction === 'forward' ? 1 : -1
    ref.current.rotation.y = Math.atan2(dx * moveDir, dz * moveDir)
  })

  const carColor = useMemo(() => {
    const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#84cc16']
    return colors[index % colors.length]
  }, [index])

  return (
    <mesh ref={ref} userData={{ progress: offset, currentRoadId: road.id }}>
      <boxGeometry args={[0.6, 0.35, 1.0]} />
      <meshStandardMaterial color={carColor} metalness={0.6} roughness={0.3} />
    </mesh>
  )
}

function RoadSegment3D({ road }: { road: RoadSegment }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const selectRoad = useStore(s => s.selectRoad)
  const controlMode = useStore(s => s.controlMode)
  const blockRoad = useStore(s => s.blockRoad)
  const unblockRoad = useStore(s => s.unblockRoad)

  const { position, rotation, length } = useMemo(() => {
    const dx = road.end[0] - road.start[0]
    const dy = road.end[1] - road.start[1]
    const dz = road.end[2] - road.start[2]
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
    const cx = (road.start[0] + road.end[0]) / 2
    const cy = (road.start[1] + road.end[1]) / 2 + 0.05
    const cz = (road.start[2] + road.end[2]) / 2
    const angle = Math.atan2(dx, dz)
    return { position: [cx, cy, cz] as [number, number, number], rotation: angle, length: len }
  }, [road])

  const color = road.blocked ? BLOCKED_COLOR : trafficColors[road.trafficLevel]
  const opacity = road.blocked ? 0.9 : 0.75

  const handleClick = (e: any) => {
    e.stopPropagation()
    const sx = e.clientX ?? (e.nativeEvent?.clientX ?? 400)
    const sy = e.clientY ?? (e.nativeEvent?.clientY ?? 300)

    if (controlMode === 'block') {
      if (road.blocked) {
        unblockRoad(road.id)
      } else {
        blockRoad(road.id, '施工管制')
      }
    } else {
      selectRoad(road, { x: sx, y: sy })
    }
  }

  return (
    <mesh ref={meshRef} position={position} rotation={[0, rotation, 0]} onClick={handleClick}>
      <planeGeometry args={[road.width, length]} />
      <meshStandardMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  )
}

function BlockedIndicator({ road }: { road: RoadSegment }) {
  if (!road.blocked) return null

  const { position, rotation, length } = useMemo(() => {
    const dx = road.end[0] - road.start[0]
    const dy = road.end[1] - road.start[1]
    const dz = road.end[2] - road.start[2]
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
    const cx = (road.start[0] + road.end[0]) / 2
    const cy = (road.start[1] + road.end[1]) / 2 + 0.1
    const cz = (road.start[2] + road.end[2]) / 2
    const angle = Math.atan2(dx, dz)
    return { position: [cx, cy, cz] as [number, number, number], rotation: angle, length: len }
  }, [road])

  const barrierCount = Math.floor(length / 8)
  const barriers = []

  for (let i = 0; i < barrierCount; i++) {
    const t = (i + 0.5) / barrierCount
    const bx = road.start[0] + (road.end[0] - road.start[0]) * t
    const by = road.start[1] + 0.3
    const bz = road.start[2] + (road.end[2] - road.start[2]) * t

    const perpX = -(road.end[2] - road.start[2]) / length
    const perpZ = (road.end[0] - road.start[0]) / length

    for (let j = -1; j <= 1; j += 2) {
      barriers.push(
        <mesh key={`barrier-${road.id}-${i}-${j}`} position={[bx + perpX * j * (road.width / 2 + 0.3), by, bz + perpZ * j * (road.width / 2 + 0.3)]}>
          <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      )
    }
  }

  return <group>{barriers}</group>
}

function RoadSurface({ road }: { road: RoadSegment }) {
  const { position, rotation, length } = useMemo(() => {
    const dx = road.end[0] - road.start[0]
    const dy = road.end[1] - road.start[1]
    const dz = road.end[2] - road.start[2]
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
    const cx = (road.start[0] + road.end[0]) / 2
    const cy = (road.start[1] + road.end[1]) / 2 + 0.02
    const cz = (road.start[2] + road.end[2]) / 2
    const angle = Math.atan2(dx, dz)
    return { position: [cx, cy, cz] as [number, number, number], rotation: angle, length: len }
  }, [road])

  return (
    <mesh position={position} rotation={[0, rotation, 0]} receiveShadow>
      <planeGeometry args={[road.width + 1, length + 1]} />
      <meshStandardMaterial color="#1a1a2e" side={THREE.DoubleSide} />
    </mesh>
  )
}

export function Roads() {
  const roads = useStore(s => s.data.roads)

  return (
    <group>
      {roads.map(road => (
        <group key={road.id}>
          <RoadSurface road={road} />
          <RoadSegment3D road={road} />
          <BlockedIndicator road={road} />
        </group>
      ))}
    </group>
  )
}

export function Cars() {
  const roads = useStore(s => s.data.roads)

  return (
    <group>
      {roads.filter(r => !r.blocked).map(road => {
        const count = Math.min(12, Math.max(3, Math.round(road.volume / 300)))
        return Array.from({ length: count }, (_, i) => (
          <CarOnRoad key={`${road.id}-car-${i}`} road={road} index={i} total={count} />
        ))
      })}
    </group>
  )
}
