import handler from '@tanstack/react-start/server-entry'
import { runDailyStatsJob } from './lib/stats/cron'
import { recordMetrics } from './lib/stats/record'

export default {
  async fetch(
    request: Request,
    env: Cloudflare.Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    ctx.waitUntil(recordMetrics(request, env.STATS_DB))
    return handler.fetch(request)
  },

  async scheduled(
    _controller: ScheduledController,
    env: Cloudflare.Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    ctx.waitUntil(runDailyStatsJob(env))
  },
} satisfies ExportedHandler<Cloudflare.Env>
