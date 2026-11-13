import { createServerFn } from '@tanstack/react-start'
import { emptyPublicStatsPayload, getLatestPublicStats } from './queries'

export const loadPublicStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const { env } = await import('cloudflare:workers')
      const bindings = env as Cloudflare.Env
      if (!bindings.STATS_DB) return emptyPublicStatsPayload()
      return await getLatestPublicStats(bindings.STATS_DB)
    } catch {
      return emptyPublicStatsPayload()
    }
  },
)
