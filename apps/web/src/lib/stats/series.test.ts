import { describe, expect, it } from 'vitest'
import {
  buildCumulativeFromDaily,
  sumLastDays,
  zeroFillDailySeries,
} from './series'

describe('zeroFillDailySeries', () => {
  it('fills missing days with zero', () => {
    const end = new Date('2025-06-10T12:00:00Z')
    const series = zeroFillDailySeries(
      3,
      [{ day: '2025-06-10', count: 2 }],
      end,
    )
    expect(series).toEqual([
      { date: '2025-06-08', value: 0 },
      { date: '2025-06-09', value: 0 },
      { date: '2025-06-10', value: 2 },
    ])
  })
})

describe('buildCumulativeFromDaily', () => {
  it('ends at total all-time', () => {
    const daily = [
      { date: '2025-06-08', value: 1 },
      { date: '2025-06-09', value: 2 },
      { date: '2025-06-10', value: 3 },
    ]
    expect(buildCumulativeFromDaily(daily, 10)).toEqual([
      { date: '2025-06-08', value: 5 },
      { date: '2025-06-09', value: 7 },
      { date: '2025-06-10', value: 10 },
    ])
  })
})

describe('sumLastDays', () => {
  it('sums trailing window', () => {
    const points = [
      { date: 'a', value: 1 },
      { date: 'b', value: 2 },
      { date: 'c', value: 3 },
    ]
    expect(sumLastDays(points, 2)).toBe(5)
  })
})
