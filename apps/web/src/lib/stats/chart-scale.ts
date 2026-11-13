import type { DailyPoint } from './types'

export type ChartPoint = { x: number; y: number; date: string; value: number }

export function scaleTrendPoints(
  points: DailyPoint[],
  viewHeight = 100,
): ChartPoint[] {
  if (points.length === 0) return []

  const maxVal = Math.max(1, ...points.map((p) => p.value))
  const lastIndex = Math.max(points.length - 1, 1)

  return points.map((p, index) => ({
    x: (index / lastIndex) * 100,
    y: viewHeight - (p.value / maxVal) * viewHeight,
    date: p.date,
    value: p.value,
  }))
}

export function areaPath(points: ChartPoint[]): string {
  if (points.length === 0) return ''
  const line = points.map((p) => `${p.x},${p.y}`).join(' ')
  const first = points[0]!
  const last = points[points.length - 1]!
  return `M ${first.x},100 L ${line} L ${last.x},100 Z`
}

export function linePath(points: ChartPoint[]): string {
  if (points.length === 0) return ''
  return `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`
}
