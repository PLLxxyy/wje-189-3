import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useStore } from '../store'

const ZONES = [
  { name: '全城总览', target: [0, 35, 5] as [number, number, number] },
  { name: '商业中心', target: [-20, 20, -20] as [number, number, number] },
  { name: '人民大道', target: [0, 20, 0] as [number, number, number] },
  { name: '长安街', target: [-30, 20, 0] as [number, number, number] },
  { name: '住宅区', target: [20, 18, 30] as [number, number, number] },
  { name: '二环高架', target: [0, 18, -35] as [number, number, number] },
]

export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const roads = useStore(s => s.data.roads)
  const blocks = useStore(s => s.data.blocks)
  const [hovered, setHovered] = useState<number | null>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    // Map city coords (-55 to 55) to canvas coords
    const mapX = (x: number) => ((x + 55) / 110) * w
    const mapZ = (z: number) => ((z + 55) / 110) * h

    // Draw blocks
    blocks.forEach(b => {
      const bx = mapX(b.position[0] - b.size[0] / 2)
      const bz = mapZ(b.position[2] - b.size[2] / 2)
      const bw = (b.size[0] / 110) * w
      const bh = (b.size[2] / 110) * h
      ctx.fillStyle = b.type === 'park' ? '#1a5a2a' : b.type === 'commercial' ? '#1a2d50' : '#2a4a2a'
      ctx.globalAlpha = 0.7
      ctx.fillRect(bx, bz, bw, bh)
    })

    ctx.globalAlpha = 1

    // Draw roads
    const trafficColors = { smooth: '#22c55e', slow: '#eab308', jam: '#ef4444' }
    roads.forEach(r => {
      ctx.beginPath()
      ctx.moveTo(mapX(r.start[0]), mapZ(r.start[2]))
      ctx.lineTo(mapX(r.end[0]), mapZ(r.end[2]))
      ctx.strokeStyle = trafficColors[r.trafficLevel]
      ctx.lineWidth = r.width / 3
      ctx.globalAlpha = 0.8
      ctx.stroke()
    })

    ctx.globalAlpha = 1
  }, [roads, blocks])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <div className="minimap">
      <div className="minimap-title">区域导航</div>
      <canvas ref={canvasRef} className="minimap-canvas" width={180} height={152} />
      <div style={{ padding: '4px 8px' }}>
        {ZONES.map((zone, i) => (
          <div
            key={i}
            onClick={() => useStore.getState().setCameraTarget(zone.target)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              fontSize: 11,
              padding: '3px 8px',
              cursor: 'pointer',
              color: hovered === i ? '#90b8ff' : '#5a7aaa',
              background: hovered === i ? 'rgba(80,140,255,0.1)' : 'transparent',
              borderRadius: 4,
              transition: 'all 0.15s'
            }}
          >
            {zone.name}
          </div>
        ))}
      </div>
    </div>
  )
}
