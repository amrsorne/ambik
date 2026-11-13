import { describe, expect, it } from 'vitest'
import { linePath, scaleTrendPoints } from './chart-scale'

describe('scaleTrendPoints', () => {
  it('maps max value to top of chart area', () => {
    const scaled = scaleTrendPoints([
      { date: '2025-01-01', value: 0 },
      { date: '2025-01-02', value: 10 },
    ])
    expect(scaled[1]?.y).toBe(0)
    expect(scaled[0]?.y).toBe(100)
  })
})

describe('linePath', () => {
  it('returns empty for no points', () => {
    expect(linePath([])).toBe('')
  })
})
