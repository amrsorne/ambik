# ambik.link/stats

Public aggregate metrics at **https://ambik.link/stats**. No PII is stored in D1 or shown on the page.

## Architecture

| Piece | Role |
|-------|------|
| **D1 `ambik-stats`** | Daily rollups + published JSON snapshots |
| **Worker `fetch`** | Increments hub views / shortcut hits (`STATS_DB`) |
| **Cron `0 16 * * *` UTC** | Midnight MYT — Supabase waitlist RPC + D1 rollup → `public_snapshots` |
| **`/stats` route** | SSR reads latest snapshot only |

## One-time setup

1. **D1** (already created for production):

   ```bash
   cd apps/web
   pnpm exec wrangler d1 migrations apply ambik-stats --local
   pnpm exec wrangler d1 migrations apply ambik-stats --remote
   ```

2. **Supabase SQL** — run [`sql/stats_public_aggregate.sql`](sql/stats_public_aggregate.sql) in the Ambik project SQL editor.

3. **Worker secrets** (never `VITE_*`):

   ```bash
   cd apps/web
   pnpm exec wrangler secret put SUPABASE_URL
   pnpm exec wrangler secret put SUPABASE_SERVICE_ROLE_KEY
   ```

   Use the same project URL as `VITE_SUPABASE_URL`; service role key from **Settings → API**.

4. **GitLab CI** — optional remote migrate on deploy (add after `wrangler deploy`):

   ```bash
   pnpm exec wrangler d1 migrations apply ambik-stats --remote
   ```

## Local development

- Dev records metrics when `STATS_DB` is bound (Wrangler/miniflare via Vite CF plugin).
- Trigger cron locally:

  ```bash
  curl "http://localhost:3000/cdn-cgi/local/scheduled?cron=0+16+*+*+*"
  ```

- Without Supabase secrets, cron still writes traffic trends; waitlist blocks stay at zero.

## Metrics published

- Waitlist total and 30-day trends (by idea / service)
- Hub page views by country (7-day snapshot)
- Apex path shortcut hits (7-day snapshot + 30-day trend)
- Excluded: emails, `source`, IPs, per-user timestamps

## Cost

Workers free tier + D1 free tier + existing Supabase free project — no paid analytics add-ons.
