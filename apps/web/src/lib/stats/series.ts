import type { DailyPoint } from './types'

const DAY_MS = 86_400_000

export function utcDayString(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

/** Last `days` UTC calendar days including today. */
export function lastUtcDayStrings(days: number, end = new Date()): string[] {
  const endUtc = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
  )
  const out: string[] = []
  for (let i = days - 1; i >= 0; i -= 1) {
    out.push(new Date(endUtc - i * DAY_MS).toISOString().slice(0, 10))
  }
  return out
}

export function zeroFillDailySeries(
  days: number,
  rows: { day: string; count: number }[],
  end = new Date(),
): DailyPoint[] {
  const byDay = new Map(rows.map((r) => [r.day, r.count]))
  return lastUtcDayStrings(days, end).map((date) => ({
    date,
    value: byDay.get(date) ?? 0,
  }))
}

/** Build cumulative totals from daily signups + known all-time total (newest day = total). */
export function buildCumulativeFromDaily(
  signupsDaily: DailyPoint[],
  totalAllTime: number,
): DailyPoint[] {
  if (signupsDaily.length === 0) return []

  let running = totalAllTime
  const result: DailyPoint[] = []

  for (let i = signupsDaily.length - 1; i >= 0; i -= 1) {
    const point = signupsDaily[i]!
    running = Math.max(0, running)
    result.unshift({ date: point.date, value: running })
    running -= point.value
  }

  return result
}

export function sumLastDays(points: DailyPoint[], days: number): number {
  const slice = points.slice(-days)
  return slice.reduce((sum, p) => sum + p.value, 0)
}
