import { create } from 'zustand'

export type TrafficLevel = 'smooth' | 'slow' | 'jam'

export interface RoadSegment {
  id: string
  name: string
  start: [number, number, number]
  end: [number, number, number]
  width: number
  trafficLevel: TrafficLevel
  speed: number        // km/h
  volume: number       // vehicles/hour
  congestionIndex: number // 0-10
}

export interface TrafficLight {
  id: string
  position: [number, number, number]
  intersection: string
  cycleTime: number       // seconds
  greenPhase: number      // seconds
  queueLength: number     // vehicles
  currentPhase: 'red' | 'green' | 'yellow'
}

export interface CityBlock {
  id: string
  position: [number, number, number]
  size: [number, number, number]
  color: string
  type: 'commercial' | 'residential' | 'park'
}

export interface Car {
  id: string
  roadId: string
  progress: number // 0-1 along the road
  speed: number
  color: string
}

export interface CityData {
  roads: RoadSegment[]
  trafficLights: TrafficLight[]
  blocks: CityBlock[]
  stats: {
    avgSpeed: number
    totalVehicles: number
    accidents: number
  }
}

// Generate city data
function generateCityData(): CityData {
  const roads: RoadSegment[] = [
    // Main horizontal roads
    { id: 'r1', name: '中山路', start: [-50, 0, -20], end: [50, 0, -20], width: 4, trafficLevel: 'smooth', speed: 48, volume: 820, congestionIndex: 2.5 },
    { id: 'r2', name: '人民大道', start: [-50, 0, 0], end: [50, 0, 0], width: 5, trafficLevel: 'jam', speed: 12, volume: 2400, congestionIndex: 8.7 },
    { id: 'r3', name: '建设路', start: [-50, 0, 20], end: [50, 0, 20], width: 4, trafficLevel: 'slow', speed: 28, volume: 1500, congestionIndex: 5.3 },
    { id: 'r4', name: '解放大道', start: [-50, 0, 40], end: [50, 0, 40], width: 4, trafficLevel: 'smooth', speed: 52, volume: 680, congestionIndex: 1.8 },
    // Main vertical roads
    { id: 'r5', name: '长安街', start: [-30, 0, -50], end: [-30, 0, 50], width: 5, trafficLevel: 'jam', speed: 10, volume: 2800, congestionIndex: 9.2 },
    { id: 'r6', name: '新华路', start: [0, 0, -50], end: [0, 0, 50], width: 4, trafficLevel: 'slow', speed: 25, volume: 1600, congestionIndex: 6.1 },
    { id: 'r7', name: '胜利街', start: [30, 0, -50], end: [30, 0, 50], width: 4, trafficLevel: 'smooth', speed: 45, volume: 900, congestionIndex: 3.0 },
    // Overpass / elevated road
    { id: 'r8', name: '二环高架', start: [-45, 4, -35], end: [45, 4, -35], width: 3.5, trafficLevel: 'slow', speed: 30, volume: 1800, congestionIndex: 5.8 },
    { id: 'r9', name: '三环高架', start: [-40, 4, 35], end: [40, 4, 35], width: 3.5, trafficLevel: 'smooth', speed: 55, volume: 1200, congestionIndex: 2.2 },
    // Side roads
    { id: 'r10', name: '滨江路', start: [-20, 0, -40], end: [-20, 0, 40], width: 3, trafficLevel: 'smooth', speed: 40, volume: 500, congestionIndex: 1.5 },
    { id: 'r11', name: '花园路', start: [20, 0, -40], end: [20, 0, 40], width: 3, trafficLevel: 'slow', speed: 22, volume: 1100, congestionIndex: 4.8 },
    { id: 'r12', name: '学院路', start: [-50, 0, -40], end: [50, 0, -40], width: 3, trafficLevel: 'smooth', speed: 38, volume: 600, congestionIndex: 2.0 },
  ]

  const trafficLights: TrafficLight[] = [
    { id: 'tl1', position: [-30, 0, -20], intersection: '长安街-中山路口', cycleTime: 120, greenPhase: 45, queueLength: 18, currentPhase: 'red' },
    { id: 'tl2', position: [0, 0, -20], intersection: '新华路-中山路口', cycleTime: 90, greenPhase: 35, queueLength: 12, currentPhase: 'green' },
    { id: 'tl3', position: [30, 0, -20], intersection: '胜利街-中山路口', cycleTime: 100, greenPhase: 40, queueLength: 8, currentPhase: 'green' },
    { id: 'tl4', position: [-30, 0, 0], intersection: '长安街-人民大道口', cycleTime: 150, greenPhase: 50, queueLength: 32, currentPhase: 'red' },
    { id: 'tl5', position: [0, 0, 0], intersection: '新华路-人民大道口', cycleTime: 120, greenPhase: 40, queueLength: 25, currentPhase: 'yellow' },
    { id: 'tl6', position: [30, 0, 0], intersection: '胜利街-人民大道口', cycleTime: 100, greenPhase: 38, queueLength: 15, currentPhase: 'green' },
    { id: 'tl7', position: [-30, 0, 20], intersection: '长安街-建设路口', cycleTime: 110, greenPhase: 42, queueLength: 20, currentPhase: 'red' },
    { id: 'tl8', position: [0, 0, 20], intersection: '新华路-建设路口', cycleTime: 100, greenPhase: 38, queueLength: 14, currentPhase: 'green' },
    { id: 'tl9', position: [30, 0, 20], intersection: '胜利街-建设路口', cycleTime: 90, greenPhase: 35, queueLength: 6, currentPhase: 'green' },
    { id: 'tl10', position: [-30, 0, 40], intersection: '长安街-解放大道口', cycleTime: 100, greenPhase: 40, queueLength: 10, currentPhase: 'green' },
    { id: 'tl11', position: [0, 0, 40], intersection: '新华路-解放大道口', cycleTime: 90, greenPhase: 35, queueLength: 5, currentPhase: 'green' },
  ]

  const blocks: CityBlock[] = [
    // Commercial
    { id: 'b1', position: [-40, 3, -30], size: [16, 6, 16], color: '#2a4070', type: 'commercial' },
    { id: 'b2', position: [15, 4.5, -30], size: [12, 9, 14], color: '#1e3a5f', type: 'commercial' },
    { id: 'b3', position: [-15, 5, -10], size: [14, 10, 16], color: '#253d6a', type: 'commercial' },
    { id: 'b4', position: [40, 3.5, -10], size: [16, 7, 14], color: '#1c3050', type: 'commercial' },
    // Residential
    { id: 'b5', position: [-42, 2, 10], size: [12, 4, 14], color: '#3a5a3a', type: 'residential' },
    { id: 'b6', position: [-10, 2.5, 30], size: [14, 5, 14], color: '#2d4a2d', type: 'residential' },
    { id: 'b7', position: [15, 2, 30], size: [16, 4, 12], color: '#3d5a3d', type: 'residential' },
    { id: 'b8', position: [40, 2, 10], size: [14, 4, 16], color: '#2a4a2a', type: 'residential' },
    { id: 'b9', position: [-40, 1.8, 30], size: [10, 3.6, 12], color: '#3a5a3a', type: 'residential' },
    // Parks
    { id: 'b10', position: [10, 0.3, -10], size: [10, 0.6, 10], color: '#1a5a2a', type: 'park' },
    { id: 'b11', position: [-10, 0.3, 10], size: [8, 0.6, 8], color: '#1a5a2a', type: 'park' },
    // More buildings
    { id: 'b12', position: [40, 6, -30], size: [14, 12, 12], color: '#1a2d50', type: 'commercial' },
    { id: 'b13', position: [-15, 3.5, 35], size: [10, 7, 8], color: '#2d4a2d', type: 'residential' },
    { id: 'b14', position: [25, 3, 35], size: [12, 6, 10], color: '#3d5a3d', type: 'residential' },
    { id: 'b15', position: [-40, 4, -10], size: [10, 8, 10], color: '#253d6a', type: 'commercial' },
  ]

  return {
    roads,
    trafficLights,
    blocks,
    stats: { avgSpeed: 32, totalVehicles: 14580, accidents: 3 }
  }
}

interface AppState {
  data: CityData
  timeHour: number         // 0-24
  timeSpeed: number        // 1x, 2x, 4x
  playing: boolean
  selectedRoad: RoadSegment | null
  selectedLight: TrafficLight | null
  popupPos: { x: number; y: number } | null
  cameraTarget: [number, number, number]

  setTimeHour: (h: number) => void
  setTimeSpeed: (s: number) => void
  setPlaying: (p: boolean) => void
  selectRoad: (r: RoadSegment | null, pos?: { x: number; y: number }) => void
  selectLight: (l: TrafficLight | null, pos?: { x: number; y: number }) => void
  setCameraTarget: (t: [number, number, number]) => void
  updateData: () => void
}

function getTrafficForHour(base: RoadSegment, hour: number): RoadSegment {
  // Simulate traffic patterns based on time of day
  const morningPeak = Math.exp(-Math.pow(hour - 8.5, 2) / 3)
  const eveningPeak = Math.exp(-Math.pow(hour - 18, 2) / 4)
  const peakFactor = 0.3 + 0.7 * Math.max(morningPeak, eveningPeak)

  const volume = Math.round(base.volume * peakFactor * (0.8 + Math.random() * 0.4))
  const speedFactor = 1 / (0.5 + peakFactor * 0.8)
  const speed = Math.round(Math.max(5, base.speed * speedFactor * (0.85 + Math.random() * 0.3)))
  const congestionIndex = Math.min(10, Math.max(0, 10 * peakFactor * (0.7 + Math.random() * 0.6)))

  let trafficLevel: TrafficLevel = 'smooth'
  if (congestionIndex > 7) trafficLevel = 'jam'
  else if (congestionIndex > 4) trafficLevel = 'slow'

  return { ...base, speed, volume, congestionIndex, trafficLevel }
}

export const useStore = create<AppState>((set, get) => ({
  data: generateCityData(),
  timeHour: 8.5,
  timeSpeed: 1,
  playing: true,
  selectedRoad: null,
  selectedLight: null,
  popupPos: null,
  cameraTarget: [0, 8, 0],

  setTimeHour: (h) => set({ timeHour: h % 24 }),
  setTimeSpeed: (s) => set({ timeSpeed: s }),
  setPlaying: (p) => set({ playing: p }),
  selectRoad: (r, pos) => set({ selectedRoad: r, selectedLight: null, popupPos: pos || null }),
  selectLight: (l, pos) => set({ selectedLight: l, selectedRoad: null, popupPos: pos || null }),
  setCameraTarget: (t) => set({ cameraTarget: t }),

  updateData: () => {
    const state = get()
    const hour = state.timeHour
    const newRoads = state.data.roads.map(r => getTrafficForHour(r, hour))

    // Update traffic lights phase
    const now = Date.now() / 1000
    const newLights = state.data.trafficLights.map(tl => {
      const cyclePos = (now % tl.cycleTime) / tl.cycleTime
      let currentPhase: 'red' | 'green' | 'yellow' = 'red'
      const greenRatio = tl.greenPhase / tl.cycleTime
      if (cyclePos < greenRatio) currentPhase = 'green'
      else if (cyclePos < greenRatio + 0.08) currentPhase = 'yellow'
      else currentPhase = 'red'
      return { ...tl, currentPhase }
    })

    const avgSpeed = Math.round(newRoads.reduce((s, r) => s + r.speed, 0) / newRoads.length)
    const totalVehicles = Math.round(newRoads.reduce((s, r) => s + r.volume, 0) * 0.6)
    const accidents = Math.round(avgSpeed < 20 ? 5 : avgSpeed < 30 ? 3 : 1)

    set({
      data: { roads: newRoads, trafficLights: newLights, blocks: state.data.blocks, stats: { avgSpeed, totalVehicles, accidents } }
    })
  }
}))
