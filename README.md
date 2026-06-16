# 城市交通3D沙盘

基于 React + Three.js 的城市交通实时监控3D可视化系统。

## 功能特性

- **3D城市模型**: 道路、立交桥、红绿灯、沿街建筑组成的城区立体沙盘
- **车流模拟**: 小车模型沿道路流动，颜色编码表示路况（绿色畅通/黄色缓行/红色拥堵）
- **交互操作**: 鼠标旋转缩放，点击道路查看实时车速/车流量/拥堵指数
- **红绿灯系统**: 点击红绿灯查看信号配时和排队长度
- **数据面板**: 顶部显示全城平均车速、在途车辆数、交通事故数
- **小地图导航**: 左上角小地图可快速定位到不同城区
- **时间轴回放**: 底部时间轴可回放早晚高峰车流变化，支持1x/2x/4x变速

## 技术栈

- Vite + React 18 + TypeScript
- @react-three/fiber + @react-three/drei + Three.js
- Zustand 状态管理

## 快速开始

```bash
npm install
npm run dev
```

打开浏览器访问 http://localhost:3000

## 项目结构

```
src/
  App.tsx              # 主应用入口
  store.ts             # 全局状态与数据模型
  main.tsx             # 渲染入口
  components/
    Roads.tsx           # 道路与车辆
    Buildings.tsx       # 建筑与地面
    TrafficLights.tsx   # 红绿灯
    Overpass.tsx        # 立交桥
    UI.tsx              # 顶部面板、时间轴、图例、信息弹窗
    Minimap.tsx         # 小地图
    TimeUpdater.tsx     # 时间与数据更新器
```
