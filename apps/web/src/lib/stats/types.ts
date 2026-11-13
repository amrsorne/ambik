export const PUBLIC_STATS_SCHEMA_VERSION = 1 as const

export type DailyPoint = { date: string; value: number }

export type CountByLabel = { label: string; count: number }

export type CountryShare = { code: string; count: number; percent: number }

export type PublicStatsTrends = {
  waitlistSignupsDaily: DailyPoint[]
  waitlistTotalDaily: DailyPoint[]
  hubViewsDaily: DailyPoint[]
  redirectsDaily: DailyPoint[]
}

export type PublicStatsPayload = {
  schemaVersion: typeof PUBLIC_STATS_SCHEMA_VERSION
  asOf: string | null
  generatedAt: string | null
  waitlistTotal: number
  waitlistNew7d: number
  waitlistNew30d: number
  byService: CountByLabel[]
  topCountries: CountryShare[]
  redirectsBySlug: CountByLabel[]
  trends: PublicStatsTrends
}

export type WaitlistRpcResult = {
  total: number
  new_7d: number
  new_30d: number
  by_service: { service: string; count: number }[]
  signups_daily: { day: string; count: number }[]
}
