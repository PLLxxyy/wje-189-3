import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoadSegment, useStore, TrafficLevel } from '../store'

const trafficColors: Record<TrafficLevel, string> = {
  smooth: '#22c55e',
  slow: '#eab308',
  jam: '#ef4444'
}

function CarOnRoad({ road, index, total }: { road: RoadSegment; index: number; total: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const offset = index / total

  useFrame((_, delta) => {
    if (!ref.current) return
    const state = useStore.getState()
    const r = state.data.roads.find(rd => rd.id === road.id)
    if (!r) return

    const speedFactor = r.speed / 60
    const timeSpeed = state.timeSpeed

    ref.current.userData.progress = ((ref.current.userData.progress || offset) + delta * speedFactor * timeSpeed * 0.05) % 1

    const t = ref.current.userData.progress
    const sx = road.start[0] + (road.end[0] - road.start[0]) * t
    const sy = road.start[1] + (road.end[1] - road.start[1]) * t + 0.4
    const sz = road.start[2] + (road.end[2] - road.start[2]) * t

    // Offset cars slightly on the road
    const dx = road.end[0] - road.start[0]
    const dz = road.end[2] - road.start[2]
    const len = Math.sqrt(dx * dx + dz * dz)
    const perpX = -dz / len
    const perpZ = dx / len
    const laneOffset = ((index % 3) - 1) * 0.8

    ref.current.position.set(sx + perpX * laneOffset, sy, sz + perpZ * laneOffset)

    // Rotate car along road direction
    ref.current.rotation.y = Math.atan2(dx, dz)
  })

  const carColor = useMemo(() => {
    const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#84cc16']
    return colors[index % colors.length]
  }, [index])

  return (
    <mesh ref={ref} userData={{ progress: offset }}>
      <boxGeometry args={[0.6, 0.35, 1.0]} />
      <meshStandardMaterial color={carColor} metalness={0.6} roughness={0.3} />
    </mesh>
  )
}

function RoadSegment3D({ road }: { road: RoadSegment }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const selectRoad = useStore(s => s.selectRoad)

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

  const color = trafficColors[road.trafficLevel]

  const handleClick = (e: any) => {
    e.stopPropagation()
    const sx = e.clientX ?? (e.nativeEvent?.clientX ?? 400)
    const sy = e.clientY ?? (e.nativeEvent?.clientY ?? 300)
    selectRoad(road, { x: sx, y: sy })
  }

  return (
    <mesh ref={meshRef} position={position} rotation={[0, rotation, 0]} onClick={handleClick}>
      <planeGeometry args={[road.width, length]} />
      <meshStandardMaterial color={color} transparent opacity={0.75} side={THREE.DoubleSide} />
    </mesh>
  )
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
        </group>
      ))}
    </group>
  )
}

export function Cars() {
  const roads = useStore(s => s.data.roads)

  return (
    <group>
      {roads.map(road => {
        const count = Math.min(12, Math.max(3, Math.round(road.volume / 300)))
        return Array.from({ length: count }, (_, i) => (
          <CarOnRoad key={`${road.id}-car-${i}`} road={road} index={i} total={count} />
        ))
      })}
    </group>
  )
}
