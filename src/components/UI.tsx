import React, { useMemo } from 'react'
import { useStore } from '../store'

export function TopBar() {
  const stats = useStore(s => s.data.stats)

  return (
    <div className="top-bar">
      <div className="stat-card">
        <span className="label">全城平均车速</span>
        <span className={`value ${stats.avgSpeed > 35 ? 'green' : stats.avgSpeed > 20 ? 'yellow' : 'red'}`}>
          {stats.avgSpeed} km/h
        </span>
      </div>
      <div className="stat-card">
        <span className="label">在途车辆数</span>
        <span className="value blue">{stats.totalVehicles.toLocaleString()}</span>
      </div>
      <div className="stat-card">
        <span className="label">交通事故</span>
        <span className={`value ${stats.accidents > 3 ? 'red' : stats.accidents > 1 ? 'yellow' : 'green'}`}>
          {stats.accidents} 起
        </span>
      </div>
    </div>
  )
}

export function Timeline() {
  const timeHour = useStore(s => s.timeHour)
  const timeSpeed = useStore(s => s.timeSpeed)
  const playing = useStore(s => s.playing)
  const setTimeHour = useStore(s => s.setTimeHour)
  const setTimeSpeed = useStore(s => s.setTimeSpeed)
  const setPlaying = useStore(s => s.setPlaying)

  const timeStr = useMemo(() => {
    const h = Math.floor(timeHour)
    const m = Math.floor((timeHour % 1) * 60)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }, [timeHour])

  const periodLabel = useMemo(() => {
    if (timeHour >= 7 && timeHour < 10) return '早高峰'
    if (timeHour >= 17 && timeHour < 20) return '晚高峰'
    if (timeHour >= 10 && timeHour < 17) return '平峰期'
    return '夜间'
  }, [timeHour])

  return (
    <div className="timeline">
      <div className="timeline-inner">
        <div className="timeline-header">
          <span>时间轴 - {timeStr} ({periodLabel})</span>
          <div className="timeline-controls">
            <button className={`timeline-btn ${!playing ? 'active' : ''}`} onClick={() => setPlaying(!playing)}>
              {playing ? '暂停' : '播放'}
            </button>
            <button className="timeline-btn" onClick={() => setTimeHour(7.5)}>早高峰</button>
            <button className="timeline-btn" onClick={() => setTimeHour(12)}>午间</button>
            <button className="timeline-btn" onClick={() => setTimeHour(18)}>晚高峰</button>
            <button className="timeline-btn" onClick={() => setTimeHour(23)}>夜间</button>
            <span className="speed-label">速度:</span>
            {[1, 2, 4].map(s => (
              <button
                key={s}
                className={`timeline-btn ${timeSpeed === s ? 'active' : ''}`}
                onClick={() => setTimeSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
        <input
          type="range"
          className="timeline-slider"
          min={0}
          max={24}
          step={0.1}
          value={timeHour}
          onChange={e => setTimeHour(parseFloat(e.target.value))}
        />
        <div className="timeline-ticks">
          {[0, 3, 6, 9, 12, 15, 18, 21, 24].map(h => (
            <span key={h}>{h}:00</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Legend() {
  return (
    <div className="legend">
      <div className="legend-title">路况图例</div>
      <div className="legend-item"><div className="legend-dot" style={{ background: '#22c55e' }} /> 畅通</div>
      <div className="legend-item"><div className="legend-dot" style={{ background: '#eab308' }} /> 缓行</div>
      <div className="legend-item"><div className="legend-dot" style={{ background: '#ef4444' }} /> 拥堵</div>
    </div>
  )
}

export function InfoPopup() {
  const selectedRoad = useStore(s => s.selectedRoad)
  const selectedLight = useStore(s => s.selectedLight)
  const popupPos = useStore(s => s.popupPos)
  const selectRoad = useStore(s => s.selectRoad)
  const selectLight = useStore(s => s.selectLight)

  if (!popupPos) return null

  if (selectedRoad) {
    const tlColor = selectedRoad.trafficLevel === 'smooth' ? '#22c55e' : selectedRoad.trafficLevel === 'slow' ? '#eab308' : '#ef4444'
    const tlText = selectedRoad.trafficLevel === 'smooth' ? '畅通' : selectedRoad.trafficLevel === 'slow' ? '缓行' : '拥堵'
    return (
      <div className="info-popup" style={{ left: popupPos.x + 16, top: popupPos.y - 60 }}>
        <button className="close-btn" onClick={() => selectRoad(null)}>&times;</button>
        <div className="title">{selectedRoad.name}</div>
        <div className="row"><span className="lbl">实时车速</span><span className="val" style={{ color: tlColor }}>{selectedRoad.speed} km/h</span></div>
        <div className="row"><span className="lbl">车流量</span><span className="val">{selectedRoad.volume} 辆/时</span></div>
        <div className="row"><span className="lbl">拥堵指数</span><span className="val" style={{ color: tlColor }}>{selectedRoad.congestionIndex.toFixed(1)}</span></div>
        <div className="row"><span className="lbl">路况状态</span><span className="val" style={{ color: tlColor }}>{tlText}</span></div>
      </div>
    )
  }

  if (selectedLight) {
    const phaseColor = selectedLight.currentPhase === 'red' ? '#ff4040' : selectedLight.currentPhase === 'green' ? '#40ff60' : '#ffcc00'
    const phaseText = selectedLight.currentPhase === 'red' ? '红灯' : selectedLight.currentPhase === 'green' ? '绿灯' : '黄灯'
    return (
      <div className="info-popup" style={{ left: popupPos.x + 16, top: popupPos.y - 80 }}>
        <button className="close-btn" onClick={() => selectLight(null)}>&times;</button>
        <div className="title">{selectedLight.intersection}</div>
        <div className="row"><span className="lbl">信号灯状态</span><span className="val" style={{ color: phaseColor }}>{phaseText}</span></div>
        <div className="row"><span className="lbl">信号周期</span><span className="val">{selectedLight.cycleTime} 秒</span></div>
        <div className="row"><span className="lbl">绿灯时长</span><span className="val">{selectedLight.greenPhase} 秒</span></div>
        <div className="row"><span className="lbl">排队长度</span><span className="val" style={{ color: selectedLight.queueLength > 20 ? '#ef4444' : '#60a5fa' }}>{selectedLight.queueLength} 辆</span></div>
      </div>
    )
  }

  return null
}
