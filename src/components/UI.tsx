import React, { useMemo } from 'react'
import { useStore } from '../store'

export function TopBar() {
  const stats = useStore(s => s.data.stats)
  const roads = useStore(s => s.data.roads)
  const controlMode = useStore(s => s.controlMode)
  const setControlMode = useStore(s => s.setControlMode)
  const clearAllBlocks = useStore(s => s.clearAllBlocks)

  const blockedRoads = roads.filter(r => r.blocked)

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
      <div className="stat-card">
        <span className="label">管制路段</span>
        <span className={`value ${blockedRoads.length > 0 ? 'red' : 'green'}`}>
          {blockedRoads.length} 条
        </span>
      </div>
      <div className="control-panel">
        <span className="control-label">操作模式:</span>
        <button
          className={`mode-btn ${controlMode === 'select' ? 'active' : ''}`}
          onClick={() => setControlMode('select')}
        >
          查看模式
        </button>
        <button
          className={`mode-btn ${controlMode === 'block' ? 'active' : ''}`}
          onClick={() => setControlMode('block')}
        >
          管制模式
        </button>
        {blockedRoads.length > 0 && (
          <button className="mode-btn clear-btn" onClick={clearAllBlocks}>
            解除所有管制
          </button>
        )}
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
  const controlMode = useStore(s => s.controlMode)
  const diversionImpact = useStore(s => s.diversionImpact)
  const roads = useStore(s => s.data.roads)

  const affectedRoads = roads.filter(r => diversionImpact.has(r.id) && !r.blocked)

  return (
    <div className="legend">
      <div className="legend-title">路况图例</div>
      <div className="legend-item"><div className="legend-dot" style={{ background: '#22c55e' }} /> 畅通</div>
      <div className="legend-item"><div className="legend-dot" style={{ background: '#eab308' }} /> 缓行</div>
      <div className="legend-item"><div className="legend-dot" style={{ background: '#ef4444' }} /> 拥堵</div>
      <div className="legend-item"><div className="legend-dot" style={{ background: '#6b7280' }} /> 管制封闭</div>
      {controlMode === 'block' && (
        <div className="legend-hint">
          管制模式：点击路段可切换封锁/解封
        </div>
      )}
      {affectedRoads.length > 0 && (
        <div className="legend-section">
          <div className="legend-title">绕行影响路段</div>
          {affectedRoads.slice(0, 5).map(road => {
            const impact = diversionImpact.get(road.id) ?? 0
            return (
              <div key={road.id} className="legend-item small">
                <span className="road-name">{road.name}</span>
                <span className="impact-badge">+{Math.round(impact * 100)}%</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function InfoPopup() {
  const selectedRoad = useStore(s => s.selectedRoad)
  const selectedLight = useStore(s => s.selectedLight)
  const popupPos = useStore(s => s.popupPos)
  const selectRoad = useStore(s => s.selectRoad)
  const selectLight = useStore(s => s.selectLight)
  const blockRoad = useStore(s => s.blockRoad)
  const unblockRoad = useStore(s => s.unblockRoad)
  const diversionImpact = useStore(s => s.diversionImpact)

  if (!popupPos) return null

  if (selectedRoad) {
    const tlColor = selectedRoad.blocked ? '#6b7280' :
                    selectedRoad.trafficLevel === 'smooth' ? '#22c55e' :
                    selectedRoad.trafficLevel === 'slow' ? '#eab308' : '#ef4444'
    const tlText = selectedRoad.blocked ? '管制封闭' :
                   selectedRoad.trafficLevel === 'smooth' ? '畅通' :
                   selectedRoad.trafficLevel === 'slow' ? '缓行' : '拥堵'

    const impact = diversionImpact.get(selectedRoad.id)
    const originalVolume = selectedRoad.originalVolume ?? selectedRoad.volume
    const originalSpeed = selectedRoad.originalSpeed ?? selectedRoad.speed

    return (
      <div className="info-popup" style={{ left: popupPos.x + 16, top: popupPos.y - 60 }}>
        <button className="close-btn" onClick={() => selectRoad(null)}>&times;</button>
        <div className="title">{selectedRoad.name}</div>
        {selectedRoad.blocked && (
          <div className="blocked-banner">
            🚧 {selectedRoad.blockReason || '交通管制'}
          </div>
        )}
        <div className="row"><span className="lbl">实时车速</span><span className="val" style={{ color: tlColor }}>{selectedRoad.speed} km/h</span></div>
        <div className="row"><span className="lbl">车流量</span><span className="val">{selectedRoad.volume} 辆/时</span></div>
        <div className="row"><span className="lbl">拥堵指数</span><span className="val" style={{ color: tlColor }}>{selectedRoad.congestionIndex.toFixed(1)}</span></div>
        <div className="row"><span className="lbl">路况状态</span><span className="val" style={{ color: tlColor }}>{tlText}</span></div>
        {impact && impact > 0 && !selectedRoad.blocked && (
          <div className="row"><span className="lbl">绕行影响</span><span className="val" style={{ color: '#f97316' }}>+{Math.round(impact * 100)}% 车流量</span></div>
        )}
        {!selectedRoad.blocked && (
          <div className="row">
            <span className="lbl">基准流量</span>
            <span className="val">{originalVolume} 辆/时</span>
          </div>
        )}
        <div className="popup-actions">
          {selectedRoad.blocked ? (
            <button className="action-btn unblock" onClick={() => {
              unblockRoad(selectedRoad.id)
              selectRoad(null)
            }}>
              解除管制
            </button>
          ) : (
            <>
              <button className="action-btn block-construction" onClick={() => {
                blockRoad(selectedRoad.id, '施工管制')
                selectRoad(null)
              }}>
                🚧 施工封路
              </button>
              <button className="action-btn block-event" onClick={() => {
                blockRoad(selectedRoad.id, '活动管制')
                selectRoad(null)
              }}>
                🎪 活动封路
              </button>
            </>
          )}
        </div>
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
