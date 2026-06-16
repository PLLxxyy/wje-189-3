import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'

export function TimeUpdater() {
  const lastUpdate = useRef(0)

  useFrame((_, delta) => {
    const state = useStore.getState()

    // Advance time if playing
    if (state.playing) {
      const newHour = (state.timeHour + delta * state.timeSpeed * 0.3) % 24
      state.setTimeHour(newHour)
    }

    // Update data every ~2 seconds
    lastUpdate.current += delta
    if (lastUpdate.current > 2) {
      lastUpdate.current = 0
      state.updateData()
    }
  })

  return null
}
