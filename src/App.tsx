import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Roads, Cars } from './components/Roads'
import { Buildings, Ground } from './components/Buildings'
import { TrafficLights } from './components/TrafficLights'
import { Overpass } from './components/Overpass'
import { TopBar, Timeline, Legend, InfoPopup } from './components/UI'
import { Minimap } from './components/Minimap'

import { TimeUpdater } from './components/TimeUpdater'

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[30, 50, 20]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={120}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />
      <pointLight position={[0, 30, 0]} intensity={0.3} color="#4488ff" />
      <hemisphereLight args={['#1a2a4a', '#0a0e1a', 0.5]} />

      <fog attach="fog" args={['#0a0e1a', 50, 120]} />

      <Ground />
      <Roads />
      <Cars />
      <Buildings />
      <TrafficLights />
      <Overpass />

      <TimeUpdater />
    </>
  )
}

export default function App() {
  return (
    <>
      <Canvas shadows gl={{ antialias: true, alpha: false }} style={{ background: '#0a0e1a' }}>
        <PerspectiveCamera makeDefault position={[40, 35, 40]} fov={50} />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={10}
          maxDistance={100}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 0, 0]}
        />
        <Scene />
      </Canvas>
      <TopBar />
      <Minimap />
      <Timeline />
      <Legend />
      <InfoPopup />
    </>
  )
}
