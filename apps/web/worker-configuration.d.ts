// Wrangler bindings for ambik-web. Refresh: pnpm run cf-typegen (remove this file first if regenerating).

declare namespace Cloudflare {
  interface Env {
    STATS_DB: D1Database
    SUPABASE_URL?: string
    SUPABASE_SERVICE_ROLE_KEY?: string
  }
}
