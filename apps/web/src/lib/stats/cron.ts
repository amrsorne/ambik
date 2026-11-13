import type {
  CountByLabel,
  CountryShare,
  PublicStatsPayload,
  WaitlistRpcResult,
} from './types'
import { PUBLIC_STATS_SCHEMA_VERSION } from './types'
import {
  buildCumulativeFromDaily,
  utcDayString,
  zeroFillDailySeries,
} from './series'

const TREND_DAYS = 30

type DayCountRow = { day: string; count: number }

async function fetchWaitlistAggregates(
  supabaseUrl: string | undefined,
  serviceRoleKey: string | undefined,
): Promise<WaitlistRpcResult | null> {
  if (!supabaseUrl || !serviceRoleKey) return null

  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/stats_waitlist_public`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
  })

  if (!res.ok) {
    console.error('stats_waitlist_public failed', res.status, await res.text())
    return null
  }

  return (await res.json()) as WaitlistRpcResult
}

async function queryTrafficDaily(
  db: D1Database,
  metric: 'hub_view' | 'redirect',
): Promise<DayCountRow[]> {
  const result = await db
    .prepare(
      `SELECT day, SUM(count) AS count
       FROM metric_events_daily
       WHERE metric = ?
         AND day >= date('now', '-29 days')
       GROUP BY day
       ORDER BY day`,
    )
    .bind(metric)
    .all<{ day: string; count: number }>()

  return (result.results ?? []).map((r) => ({
    day: r.day,
    count: Number(r.count) || 0,
  }))
}

async function queryTopCountries(db: D1Database): Promise<CountryShare[]> {
  const result = await db
    .prepare(
      `SELECT dim1 AS code, SUM(count) AS count
       FROM metric_events_daily
       WHERE metric = 'hub_view'
         AND day >= date('now', '-6 days')
       GROUP BY dim1
       ORDER BY count DESC
       LIMIT 10`,
    )
    .all<{ code: string; count: number }>()

  const rows = result.results ?? []
  const total = rows.reduce((s, r) => s + (Number(r.count) || 0), 0)

  return rows.map((r) => {
    const count = Number(r.count) || 0
    const percent = total > 0 ? Math.round((count / total) * 1000) / 10 : 0
    return { code: r.code, count, percent }
  })
}

async function queryRedirectsBySlug(db: D1Database): Promise<CountByLabel[]> {
  const result = await db
    .prepare(
      `SELECT dim1 AS label, SUM(count) AS count
       FROM metric_events_daily
       WHERE metric = 'redirect'
         AND day >= date('now', '-6 days')
       GROUP BY dim1
       ORDER BY count DESC
       LIMIT 12`,
    )
    .all<{ label: string; count: number }>()

  return (result.results ?? []).map((r) => ({
    label: r.label,
    count: Number(r.count) || 0,
  }))
}

async function pruneOldMetrics(db: D1Database): Promise<void> {
  await db
    .prepare(
      `DELETE FROM metric_events_daily
       WHERE day < date('now', '-90 days')`,
    )
    .run()
}

export async function runDailyStatsJob(env: Cloudflare.Env): Promise<void> {
  const db = env.STATS_DB
  if (!db) {
    console.error('STATS_DB binding missing')
    return
  }

  const waitlist = await fetchWaitlistAggregates(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  )

  const signupsDaily = zeroFillDailySeries(
    TREND_DAYS,
    (waitlist?.signups_daily ?? []).map((r) => ({
      day: r.day,
      count: r.count,
    })),
  )

  const waitlistTotal = waitlist?.total ?? 0

  const payload: PublicStatsPayload = {
    schemaVersion: PUBLIC_STATS_SCHEMA_VERSION,
    asOf: utcDayString(),
    generatedAt: new Date().toISOString(),
    waitlistTotal,
    waitlistNew7d: waitlist?.new_7d ?? 0,
    waitlistNew30d: waitlist?.new_30d ?? 0,
    byService: (waitlist?.by_service ?? []).map((r) => ({
      label: r.service,
      count: r.count,
    })),
    topCountries: await queryTopCountries(db),
    redirectsBySlug: await queryRedirectsBySlug(db),
    trends: {
      waitlistSignupsDaily: signupsDaily,
      waitlistTotalDaily: buildCumulativeFromDaily(signupsDaily, waitlistTotal),
      hubViewsDaily: zeroFillDailySeries(
        TREND_DAYS,
        await queryTrafficDaily(db, 'hub_view'),
      ),
      redirectsDaily: zeroFillDailySeries(
        TREND_DAYS,
        await queryTrafficDaily(db, 'redirect'),
      ),
    },
  }

  await db
    .prepare(
      `INSERT INTO public_snapshots (as_of, payload)
       VALUES (?, ?)
       ON CONFLICT(as_of)
       DO UPDATE SET payload = excluded.payload, created_at = datetime('now')`,
    )
    .bind(payload.asOf, JSON.stringify(payload))
    .run()

  await pruneOldMetrics(db)
}
