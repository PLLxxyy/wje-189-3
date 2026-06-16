import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { TrafficLight as TLType, useStore } from '../store'

function TrafficLightPole({ light }: { light: TLType }) {
  const topRef = useRef<THREE.Mesh>(null)
  const selectLight = useStore(s => s.selectLight)

  useFrame(() => {
    if (!topRef.current) return
    const state = useStore.getState()
    const tl = state.data.trafficLights.find(l => l.id === light.id)
    if (!tl) return

    const mat = topRef.current.material as THREE.MeshStandardMaterial
    if (tl.currentPhase === 'red') {
      mat.color.set('#ff2020')
      mat.emissive.set('#ff0000')
      mat.emissiveIntensity = 1.2
    } else if (tl.currentPhase === 'green') {
      mat.color.set('#20ff50')
      mat.emissive.set('#00ff30')
      mat.emissiveIntensity = 1.0
    } else {
      mat.color.set('#ffcc00')
      mat.emissive.set('#ffaa00')
      mat.emissiveIntensity = 1.1
    }
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    selectLight(light, { x: e.clientX ?? 400, y: e.clientY ?? 300 })
  }

  return (
    <group position={light.position} onClick={handleClick}>
      {/* Pole */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 3, 8]} />
        <meshStandardMaterial color="#444466" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Housing */}
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[0.5, 1.4, 0.35]} />
        <meshStandardMaterial color="#222233" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Light bulb */}
      <mesh ref={topRef} position={[0, 3.4, 0.2]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ff2020" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

export function TrafficLights() {
  const lights = useStore(s => s.data.trafficLights)

  return (
    <group>
      {lights.map(light => (
        <TrafficLightPole key={light.id} light={light} />
      ))}
    </group>
  )
}
