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
  blocked: boolean
  blockReason?: string
  originalVolume?: number
  originalSpeed?: number
  originalCongestion?: number
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
  route?: string[]
  routeIndex?: number
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
    { id: 'r1', name: '中山路', start: [-50, 0, -20], end: [50, 0, -20], width: 4, trafficLevel: 'smooth', speed: 48, volume: 820, congestionIndex: 2.5, blocked: false, originalVolume: 820, originalSpeed: 48, originalCongestion: 2.5 },
    { id: 'r2', name: '人民大道', start: [-50, 0, 0], end: [50, 0, 0], width: 5, trafficLevel: 'jam', speed: 12, volume: 2400, congestionIndex: 8.7, blocked: false, originalVolume: 2400, originalSpeed: 12, originalCongestion: 8.7 },
    { id: 'r3', name: '建设路', start: [-50, 0, 20], end: [50, 0, 20], width: 4, trafficLevel: 'slow', speed: 28, volume: 1500, congestionIndex: 5.3, blocked: false, originalVolume: 1500, originalSpeed: 28, originalCongestion: 5.3 },
    { id: 'r4', name: '解放大道', start: [-50, 0, 40], end: [50, 0, 40], width: 4, trafficLevel: 'smooth', speed: 52, volume: 680, congestionIndex: 1.8, blocked: false, originalVolume: 680, originalSpeed: 52, originalCongestion: 1.8 },
    // Main vertical roads
    { id: 'r5', name: '长安街', start: [-30, 0, -50], end: [-30, 0, 50], width: 5, trafficLevel: 'jam', speed: 10, volume: 2800, congestionIndex: 9.2, blocked: false, originalVolume: 2800, originalSpeed: 10, originalCongestion: 9.2 },
    { id: 'r6', name: '新华路', start: [0, 0, -50], end: [0, 0, 50], width: 4, trafficLevel: 'slow', speed: 25, volume: 1600, congestionIndex: 6.1, blocked: false, originalVolume: 1600, originalSpeed: 25, originalCongestion: 6.1 },
    { id: 'r7', name: '胜利街', start: [30, 0, -50], end: [30, 0, 50], width: 4, trafficLevel: 'smooth', speed: 45, volume: 900, congestionIndex: 3.0, blocked: false, originalVolume: 900, originalSpeed: 45, originalCongestion: 3.0 },
    // Overpass / elevated road
    { id: 'r8', name: '二环高架', start: [-45, 4, -35], end: [45, 4, -35], width: 3.5, trafficLevel: 'slow', speed: 30, volume: 1800, congestionIndex: 5.8, blocked: false, originalVolume: 1800, originalSpeed: 30, originalCongestion: 5.8 },
    { id: 'r9', name: '三环高架', start: [-40, 4, 35], end: [40, 4, 35], width: 3.5, trafficLevel: 'smooth', speed: 55, volume: 1200, congestionIndex: 2.2, blocked: false, originalVolume: 1200, originalSpeed: 55, originalCongestion: 2.2 },
    // Side roads
    { id: 'r10', name: '滨江路', start: [-20, 0, -40], end: [-20, 0, 40], width: 3, trafficLevel: 'smooth', speed: 40, volume: 500, congestionIndex: 1.5, blocked: false, originalVolume: 500, originalSpeed: 40, originalCongestion: 1.5 },
    { id: 'r11', name: '花园路', start: [20, 0, -40], end: [20, 0, 40], width: 3, trafficLevel: 'slow', speed: 22, volume: 1100, congestionIndex: 4.8, blocked: false, originalVolume: 1100, originalSpeed: 22, originalCongestion: 4.8 },
    { id: 'r12', name: '学院路', start: [-50, 0, -40], end: [50, 0, -40], width: 3, trafficLevel: 'smooth', speed: 38, volume: 600, congestionIndex: 2.0, blocked: false, originalVolume: 600, originalSpeed: 38, originalCongestion: 2.0 },
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

export interface RoadConnection {
  from: string
  to: string
  node: [number, number, number]
}

export interface PathResult {
  path: string[]
  distance: number
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
  controlMode: 'select' | 'block'
  roadConnections: RoadConnection[]
  diversionImpact: Map<string, number>

  setTimeHour: (h: number) => void
  setTimeSpeed: (s: number) => void
  setPlaying: (p: boolean) => void
  selectRoad: (r: RoadSegment | null, pos?: { x: number; y: number }) => void
  selectLight: (l: TrafficLight | null, pos?: { x: number; y: number }) => void
  setCameraTarget: (t: [number, number, number]) => void
  setControlMode: (mode: 'select' | 'block') => void
  blockRoad: (roadId: string, reason: string) => void
  unblockRoad: (roadId: string) => void
  clearAllBlocks: () => void
  buildRoadConnections: () => void
  findShortestPath: (startRoadId: string, endRoadId: string) => PathResult | null
  findAlternativePath: (roadId: string) => Map<string, string[]>
  calculateDiversionImpact: () => void
  updateData: () => void
}

function getTrafficForHour(base: RoadSegment, hour: number): RoadSegment {
  if (base.blocked) {
    return {
      ...base,
      speed: 0,
      volume: 0,
      congestionIndex: 10,
      trafficLevel: 'jam'
    }
  }

  const morningPeak = Math.exp(-Math.pow(hour - 8.5, 2) / 3)
  const eveningPeak = Math.exp(-Math.pow(hour - 18, 2) / 4)
  const peakFactor = 0.3 + 0.7 * Math.max(morningPeak, eveningPeak)

  const baseVolume = base.originalVolume ?? base.volume
  const baseSpeed = base.originalSpeed ?? base.speed
  const baseCongestion = base.originalCongestion ?? base.congestionIndex

  const volume = Math.round(baseVolume * peakFactor * (0.8 + Math.random() * 0.4))
  const speedFactor = 1 / (0.5 + peakFactor * 0.8)
  const speed = Math.round(Math.max(5, baseSpeed * speedFactor * (0.85 + Math.random() * 0.3)))
  const congestionIndex = Math.min(10, Math.max(0, 10 * peakFactor * (0.7 + Math.random() * 0.6)))

  let trafficLevel: TrafficLevel = 'smooth'
  if (congestionIndex > 7) trafficLevel = 'jam'
  else if (congestionIndex > 4) trafficLevel = 'slow'

  return { ...base, speed, volume, congestionIndex, trafficLevel }
}

function getRoadLength(road: RoadSegment): number {
  const dx = road.end[0] - road.start[0]
  const dy = road.end[1] - road.start[1]
  const dz = road.end[2] - road.start[2]
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

function pointsEqual(p1: [number, number, number], p2: [number, number, number], eps = 0.1): boolean {
  return Math.abs(p1[0] - p2[0]) < eps && Math.abs(p1[1] - p2[1]) < eps && Math.abs(p1[2] - p2[2]) < eps
}

function isHorizontal(road: RoadSegment): boolean {
  return Math.abs(road.start[2] - road.end[2]) < 0.1
}

function isVertical(road: RoadSegment): boolean {
  return Math.abs(road.start[0] - road.end[0]) < 0.1
}

function getIntersection(r1: RoadSegment, r2: RoadSegment): [number, number, number] | null {
  const r1Horiz = isHorizontal(r1)
  const r2Horiz = isHorizontal(r2)
  const r1Vert = isVertical(r1)
  const r2Vert = isVertical(r2)

  if (r1Horiz && r2Vert) {
    const r1Z = r1.start[2]
    const r2X = r2.start[0]
    const r1Y = (r1.start[1] + r1.end[1]) / 2
    const r1XMin = Math.min(r1.start[0], r1.end[0])
    const r1XMax = Math.max(r1.start[0], r1.end[0])
    const r2ZMin = Math.min(r2.start[2], r2.end[2])
    const r2ZMax = Math.max(r2.start[2], r2.end[2])

    if (r2X >= r1XMin && r2X <= r1XMax && r1Z >= r2ZMin && r1Z <= r2ZMax) {
      return [r2X, r1Y, r1Z]
    }
  }

  if (r1Vert && r2Horiz) {
    const r1X = r1.start[0]
    const r2Z = r2.start[2]
    const r1Y = (r1.start[1] + r1.end[1]) / 2
    const r1ZMin = Math.min(r1.start[2], r1.end[2])
    const r1ZMax = Math.max(r1.start[2], r1.end[2])
    const r2XMin = Math.min(r2.start[0], r2.end[0])
    const r2XMax = Math.max(r2.start[0], r2.end[0])

    if (r1X >= r2XMin && r1X <= r2XMax && r2Z >= r1ZMin && r2Z <= r1ZMax) {
      return [r1X, r1Y, r2Z]
    }
  }

  return null
}

function getAllIntersections(roads: RoadSegment[]): Map<string, { point: [number, number, number]; roads: string[] }> {
  const intersections = new Map<string, { point: [number, number, number]; roads: string[] }>()

  for (let i = 0; i < roads.length; i++) {
    for (let j = i + 1; j < roads.length; j++) {
      const point = getIntersection(roads[i], roads[j])
      if (point) {
        const key = `${point[0].toFixed(1)},${point[1].toFixed(1)},${point[2].toFixed(1)}`
        if (!intersections.has(key)) {
          intersections.set(key, { point, roads: [] })
        }
        const entry = intersections.get(key)!
        if (!entry.roads.includes(roads[i].id)) entry.roads.push(roads[i].id)
        if (!entry.roads.includes(roads[j].id)) entry.roads.push(roads[j].id)
      }
    }
  }

  roads.forEach(road => {
    const startKey = `${road.start[0].toFixed(1)},${road.start[1].toFixed(1)},${road.start[2].toFixed(1)}`
    if (!intersections.has(startKey)) {
      intersections.set(startKey, { point: road.start, roads: [road.id] })
    } else {
      const entry = intersections.get(startKey)!
      if (!entry.roads.includes(road.id)) entry.roads.push(road.id)
    }

    const endKey = `${road.end[0].toFixed(1)},${road.end[1].toFixed(1)},${road.end[2].toFixed(1)}`
    if (!intersections.has(endKey)) {
      intersections.set(endKey, { point: road.end, roads: [road.id] })
    } else {
      const entry = intersections.get(endKey)!
      if (!entry.roads.includes(road.id)) entry.roads.push(road.id)
    }
  })

  return intersections
}

export const useStore = create<AppState>((set, get) => {
  const initialData = generateCityData()

  function buildRoadConnectionsInternal(roads: RoadSegment[]): RoadConnection[] {
    const connections: RoadConnection[] = []
    const intersections = getAllIntersections(roads)

    intersections.forEach(({ point, roads: roadIds }) => {
      for (let i = 0; i < roadIds.length; i++) {
        for (let j = 0; j < roadIds.length; j++) {
          if (i !== j) {
            connections.push({
              from: roadIds[i],
              to: roadIds[j],
              node: point
            })
          }
        }
      }
    })

    return connections
  }

  const initialConnections = buildRoadConnectionsInternal(initialData.roads)

  return {
    data: initialData,
    timeHour: 8.5,
    timeSpeed: 1,
    playing: true,
    selectedRoad: null,
    selectedLight: null,
    popupPos: null,
    cameraTarget: [0, 8, 0],
    controlMode: 'select',
    roadConnections: initialConnections,
    diversionImpact: new Map(),

    setTimeHour: (h) => set({ timeHour: h % 24 }),
    setTimeSpeed: (s) => set({ timeSpeed: s }),
    setPlaying: (p) => set({ playing: p }),
    selectRoad: (r, pos) => set({ selectedRoad: r, selectedLight: null, popupPos: pos || null }),
    selectLight: (l, pos) => set({ selectedLight: l, selectedRoad: null, popupPos: pos || null }),
    setCameraTarget: (t) => set({ cameraTarget: t }),
    setControlMode: (mode) => set({ controlMode: mode }),

    buildRoadConnections: () => {
      const state = get()
      const connections = buildRoadConnectionsInternal(state.data.roads)
      set({ roadConnections: connections })
    },

    blockRoad: (roadId: string, reason: string) => {
      const state = get()
      const newRoads = state.data.roads.map(r => {
        if (r.id === roadId && !r.blocked) {
          return {
            ...r,
            blocked: true,
            blockReason: reason,
            originalVolume: r.originalVolume ?? r.volume,
            originalSpeed: r.originalSpeed ?? r.speed,
            originalCongestion: r.originalCongestion ?? r.congestionIndex,
            volume: 0,
            speed: 0,
            congestionIndex: 10,
            trafficLevel: 'jam' as TrafficLevel
          }
        }
        return r
      })

      const blockedRoad = state.data.roads.find(r => r.id === roadId)
      if (blockedRoad && !blockedRoad.blocked) {
        set({ data: { ...state.data, roads: newRoads } })
        get().calculateDiversionImpact()
      }
    },

    unblockRoad: (roadId: string) => {
      const state = get()
      const newRoads = state.data.roads.map(r => {
        if (r.id === roadId && r.blocked) {
          return {
            ...r,
            blocked: false,
            blockReason: undefined,
            volume: r.originalVolume ?? r.volume,
            speed: r.originalSpeed ?? r.speed,
            congestionIndex: r.originalCongestion ?? r.congestionIndex
          }
        }
        return r
      })

      const blockedRoad = state.data.roads.find(r => r.id === roadId)
      if (blockedRoad && blockedRoad.blocked) {
        set({ data: { ...state.data, roads: newRoads } })
        get().calculateDiversionImpact()
      }
    },

    clearAllBlocks: () => {
      const state = get()
      const newRoads = state.data.roads.map(r => {
        if (r.blocked) {
          return {
            ...r,
            blocked: false,
            blockReason: undefined,
            volume: r.originalVolume ?? r.volume,
            speed: r.originalSpeed ?? r.speed,
            congestionIndex: r.originalCongestion ?? r.congestionIndex
          }
        }
        return r
      })
      set({ data: { ...state.data, roads: newRoads }, diversionImpact: new Map() })
    },

    findShortestPath: (startRoadId: string, endRoadId: string) => {
      const state = get()
      const roads = state.data.roads
      const { roadConnections } = state
      const blockedIds = new Set(roads.filter((r: RoadSegment) => r.blocked).map((r: RoadSegment) => r.id))

      if (blockedIds.has(startRoadId) || blockedIds.has(endRoadId)) {
        return null
      }

      interface QueueItem {
        roadId: string
        distance: number
        path: string[]
      }

      const visited = new Set<string>()
      const queue: QueueItem[] = [{ roadId: startRoadId, distance: 0, path: [startRoadId] }]

      while (queue.length > 0) {
        queue.sort((a, b) => a.distance - b.distance)
        const current = queue.shift()!

        if (current.roadId === endRoadId) {
          return { path: current.path, distance: current.distance }
        }

        if (visited.has(current.roadId)) continue
        visited.add(current.roadId)

        const currentRoad = roads.find((r: RoadSegment) => r.id === current.roadId)
        if (!currentRoad) continue

        const neighbors = roadConnections
          .filter(c => c.from === current.roadId && !blockedIds.has(c.to))
          .map(c => c.to)

        for (const neighborId of neighbors) {
          if (visited.has(neighborId)) continue
          const neighborRoad = roads.find((r: RoadSegment) => r.id === neighborId)
          if (!neighborRoad) continue

          const newDistance = current.distance + getRoadLength(neighborRoad)
          const newPath = [...current.path, neighborId]
          queue.push({ roadId: neighborId, distance: newDistance, path: newPath })
        }
      }

      return null
    },

    findAlternativePath: (blockedRoadId: string) => {
      const state = get()
      const roads = state.data.roads
      const alternativePaths = new Map<string, string[]>()

      const connectedToBlocked = state.roadConnections
        .filter(c => c.from === blockedRoadId || c.to === blockedRoadId)
        .map(c => c.from === blockedRoadId ? c.to : c.from)

      const uniqueConnected = [...new Set(connectedToBlocked)]

      for (let i = 0; i < uniqueConnected.length; i++) {
        for (let j = 0; j < uniqueConnected.length; j++) {
          if (i !== j) {
            const path = get().findShortestPath(uniqueConnected[i], uniqueConnected[j])
            if (path && !path.path.includes(blockedRoadId)) {
              alternativePaths.set(`${uniqueConnected[i]}-${uniqueConnected[j]}`, path.path)
            }
          }
        }
      }

      return alternativePaths
    },

    calculateDiversionImpact: () => {
      const state = get()
      const roads = state.data.roads
      const blockedRoads = roads.filter((r: RoadSegment) => r.blocked)
      const impact = new Map<string, number>()

      blockedRoads.forEach((blockedRoad: RoadSegment) => {
        const alternatives = get().findAlternativePath(blockedRoad.id)
        const originalVolume = blockedRoad.originalVolume ?? blockedRoad.volume
        const baseVolume = blockedRoad.originalVolume ?? blockedRoad.volume

        if (alternatives.size > 0 && baseVolume > 0) {
          alternatives.forEach((path) => {
            const volumeShare = originalVolume / Math.max(1, alternatives.size)
            path.forEach(roadId => {
              if (roadId !== blockedRoad.id) {
                const targetRoad = roads.find(r => r.id === roadId)
                if (targetRoad) {
                  const roadBaseVolume = targetRoad.originalVolume ?? targetRoad.volume
                  const impactPercent = volumeShare / Math.max(1, roadBaseVolume)
                  const current = impact.get(roadId) ?? 0
                  impact.set(roadId, current + impactPercent * 0.8)
                }
              }
            })
          })
        }

        const connectedRoads = state.roadConnections
          .filter(c => c.from === blockedRoad.id || c.to === blockedRoad.id)
          .map(c => c.from === blockedRoad.id ? c.to : c.from)
          .filter(id => id !== blockedRoad.id)

        const uniqueConnected = [...new Set(connectedRoads)]
        const nearbyImpact = Math.min(0.6, baseVolume / 5000)

        uniqueConnected.forEach(roadId => {
          const targetRoad = roads.find(r => r.id === roadId)
          if (targetRoad && !targetRoad.blocked) {
            const current = impact.get(roadId) ?? 0
            impact.set(roadId, current + nearbyImpact * 0.5)
          }
        })
      })

      set({ diversionImpact: impact })

      const newRoads = roads.map((road: RoadSegment) => {
        if (road.blocked) return road

        const impactFactor = impact.get(road.id) ?? 0
        if (impactFactor <= 0) return road

        const baseVolume = road.originalVolume ?? road.volume
        const baseSpeed = road.originalSpeed ?? road.speed
        const baseCongestion = road.originalCongestion ?? road.congestionIndex

        const newVolume = Math.round(baseVolume * (1 + impactFactor))
        const newSpeed = Math.round(Math.max(5, baseSpeed * Math.max(0.3, 1 - impactFactor * 0.4)))
        const newCongestion = Math.min(10, baseCongestion + impactFactor * 4)

        let trafficLevel: TrafficLevel = 'smooth'
        if (newCongestion > 7) trafficLevel = 'jam'
        else if (newCongestion > 4) trafficLevel = 'slow'

        return {
          ...road,
          volume: newVolume,
          speed: newSpeed,
          congestionIndex: newCongestion,
          trafficLevel
        }
      })

      set({ data: { ...state.data, roads: newRoads } })
    },

    updateData: () => {
      const state = get()
      const hour = state.timeHour

      let newRoads = state.data.roads.map(r => {
        if (r.blocked) {
          return {
            ...r,
            speed: 0,
            volume: 0,
            congestionIndex: 10,
            trafficLevel: 'jam' as TrafficLevel
          }
        }
        return getTrafficForHour(r, hour)
      })

      const impact = state.diversionImpact
      if (impact.size > 0) {
        newRoads = newRoads.map(road => {
          if (road.blocked) return road

          const impactFactor = impact.get(road.id) ?? 0
          if (impactFactor <= 0) return road

          const newVolume = Math.round(road.volume * (1 + impactFactor))
          const newSpeed = Math.round(Math.max(5, road.speed * Math.max(0.3, 1 - impactFactor * 0.4)))
          const newCongestion = Math.min(10, road.congestionIndex + impactFactor * 4)

          let trafficLevel: TrafficLevel = 'smooth'
          if (newCongestion > 7) trafficLevel = 'jam'
          else if (newCongestion > 4) trafficLevel = 'slow'

          return {
            ...road,
            volume: newVolume,
            speed: newSpeed,
            congestionIndex: newCongestion,
            trafficLevel
          }
        })
      }

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

      const unblockedRoads = newRoads.filter(r => !r.blocked)
      const avgSpeed = Math.round(unblockedRoads.reduce((s, r) => s + r.speed, 0) / Math.max(1, unblockedRoads.length))
      const totalVehicles = Math.round(newRoads.reduce((s, r) => s + r.volume, 0) * 0.6)
      const accidents = Math.round(avgSpeed < 20 ? 5 : avgSpeed < 30 ? 3 : 1)

      set({
        data: { roads: newRoads, trafficLights: newLights, blocks: state.data.blocks, stats: { avgSpeed, totalVehicles, accidents } }
      })
    }
  }
})

if (typeof window !== 'undefined') {
  (window as any).__trafficStore = useStore;
}
