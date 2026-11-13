import type { PublicStatsPayload } from './types'
import { PUBLIC_STATS_SCHEMA_VERSION } from './types'

export function emptyPublicStatsPayload(): PublicStatsPayload {
  return {
    schemaVersion: PUBLIC_STATS_SCHEMA_VERSION,
    asOf: null,
    generatedAt: null,
    waitlistTotal: 0,
    waitlistNew7d: 0,
    waitlistNew30d: 0,
    byService: [],
    topCountries: [],
    redirectsBySlug: [],
    trends: {
      waitlistSignupsDaily: [],
      waitlistTotalDaily: [],
      hubViewsDaily: [],
      redirectsDaily: [],
    },
  }
}

export async function getLatestPublicStats(
  db: D1Database,
): Promise<PublicStatsPayload> {
  const row = await db
    .prepare(
      `SELECT payload FROM public_snapshots
       ORDER BY as_of DESC
       LIMIT 1`,
    )
    .first<{ payload: string }>()

  if (!row?.payload) return emptyPublicStatsPayload()

  try {
    const parsed = JSON.parse(row.payload) as PublicStatsPayload
    if (parsed.schemaVersion !== PUBLIC_STATS_SCHEMA_VERSION) {
      return emptyPublicStatsPayload()
    }
    return parsed
  } catch {
    return emptyPublicStatsPayload()
  }
}
