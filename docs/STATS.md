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

2. **Supabase SQL** — run [`sql/stats_public_aggregate.sql`](sql/stats_public_aggregate.sql) in the Ambik project SQL editor. The RPC grants **execute** to the Postgres role `service_role` (that role is what Secret keys use; it is not the deprecated `service_role` *API key*).

3. **Worker secrets** (never `VITE_*`):

   Follow [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys): **Publishable** (`sb_publishable_…`) in the browser, **Secret** (`sb_secret_…`) on servers. Legacy JWT `anon` / `service_role` API keys are deprecated (retiring by end of 2026).

   | Worker secret | Value |
   |---------------|--------|
   | `SUPABASE_URL` | `https://zwjcafxhvblzwejtzmsn.supabase.co` |
   | `SUPABASE_SECRET_KEY` | Settings → **API Keys** → Secret key (`sb_secret_…`) |

   ```bash
   cd apps/web
   pnpm exec wrangler secret put SUPABASE_URL
   pnpm exec wrangler secret put SUPABASE_SECRET_KEY
   ```

   Production: `SUPABASE_URL` is already on `ambik-web`. Add `SUPABASE_SECRET_KEY` when you have the Secret key from the dashboard (Settings → API Keys, not the legacy JWT block).

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
