import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { CityBlock, useStore } from '../store'

function Building({ block }: { block: CityBlock }) {
  const ref = useRef<THREE.Mesh>(null)

  return (
    <mesh ref={ref} position={block.position} castShadow receiveShadow>
      <boxGeometry args={block.size} />
      <meshStandardMaterial
        color={block.color}
        metalness={block.type === 'commercial' ? 0.5 : 0.1}
        roughness={block.type === 'commercial' ? 0.3 : 0.7}
      />
    </mesh>
  )
}

function ParkBlock({ block }: { block: CityBlock }) {
  return (
    <group position={block.position}>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[block.size[0], 0.2, block.size[2]]} />
        <meshStandardMaterial color="#1a6b2a" roughness={0.9} />
      </mesh>
      {/* Simple trees */}
      {[[-2, 0, -2], [2, 0, 1], [-1, 0, 2], [3, 0, -1]].map(([tx, _, tz], i) => (
        <group key={i} position={[tx, 0, tz]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 2.4, 6]} />
            <meshStandardMaterial color="#5a3a1a" />
          </mesh>
          <mesh position={[0, 2.8, 0]}>
            <coneGeometry args={[1, 2.5, 8]} />
            <meshStandardMaterial color="#2d8a4e" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function Buildings() {
  const blocks = useStore(s => s.data.blocks)

  return (
    <group>
      {blocks.map(block =>
        block.type === 'park' ? (
          <ParkBlock key={block.id} block={block} />
        ) : (
          <Building key={block.id} block={block} />
        )
      )}
    </group>
  )
}

// Ground plane
export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[120, 120]} />
      <meshStandardMaterial color="#0d1520" roughness={1} />
    </mesh>
  )
}
