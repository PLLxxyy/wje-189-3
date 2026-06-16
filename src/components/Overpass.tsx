import React, { useMemo } from 'react'
import * as THREE from 'three'

// Overpass / elevated road pillars and guardrails
export function Overpass() {
  const pillars = useMemo(() => {
    // Pillars for the two elevated roads (r8 and r9)
    const r8Pillars: [number, number, number][] = []
    for (let x = -42; x <= 42; x += 12) {
      r8Pillars.push([x, 2, -35])
    }
    const r9Pillars: [number, number, number][] = []
    for (let x = -38; x <= 38; x += 12) {
      r9Pillars.push([x, 2, 35])
    }
    return { r8Pillars, r9Pillars }
  }, [])

  return (
    <group>
      {/* Pillars for overpass 1 */}
      {pillars.r8Pillars.map((pos, i) => (
        <mesh key={`p8-${i}`} position={pos} castShadow>
          <boxGeometry args={[0.8, 4, 0.8]} />
          <meshStandardMaterial color="#3a3a50" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      {/* Pillars for overpass 2 */}
      {pillars.r9Pillars.map((pos, i) => (
        <mesh key={`p9-${i}`} position={pos} castShadow>
          <boxGeometry args={[0.8, 4, 0.8]} />
          <meshStandardMaterial color="#3a3a50" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      {/* Guardrails */}
      <mesh position={[0, 4.3, -35 + 2]} castShadow>
        <boxGeometry args={[92, 0.3, 0.1]} />
        <meshStandardMaterial color="#555570" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 4.3, -35 - 2]} castShadow>
        <boxGeometry args={[92, 0.3, 0.1]} />
        <meshStandardMaterial color="#555570" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 4.3, 35 + 2]} castShadow>
        <boxGeometry args={[82, 0.3, 0.1]} />
        <meshStandardMaterial color="#555570" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 4.3, 35 - 2]} castShadow>
        <boxGeometry args={[82, 0.3, 0.1]} />
        <meshStandardMaterial color="#555570" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}
