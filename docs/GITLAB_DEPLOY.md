# GitLab CI → Cloudflare Worker (`ambik-web`)

Production deploys run from **GitLab pipelines** (not manual `wrangler deploy` on your laptop). Each push to **`main`** runs tests, then **`wrangler deploy`** to the existing Worker **`ambik-web`** (custom domain **ambik.link** is already attached in Cloudflare).

## One-time GitLab setup

Project: [gitlab.com/ameersorne/ideas/ambik/ambik](https://gitlab.com/ameersorne/ideas/ambik/ambik)

Go to **Settings → CI/CD → Variables** and add:

| Variable | Masked | Protected | Notes |
|----------|--------|-----------|--------|
| `CLOUDFLARE_API_TOKEN` | yes | yes | [Edit Cloudflare Workers](https://developers.cloudflare.com/workers/ci-cd/external-cicd/gitlab-cicd/) permission on your account |
| `CLOUDFLARE_ACCOUNT_ID` | no | yes | Account ID (same account as `ambik.link` zone) |
| `VITE_SUPABASE_URL` | yes | yes | `https://zwjcafxhvblzwejtzmsn.supabase.co` (Ambik — see [WAITLIST_SUPABASE.md](WAITLIST_SUPABASE.md)) |
| `VITE_SUPABASE_ANON_KEY` | yes | yes | Anon key from that project (Settings → API) |
| `VITE_CF_TURNSTILE_SITE_KEY` | yes | yes | Optional until Turnstile is re-enabled — see [WAITLIST_TODO.md](WAITLIST_TODO.md) |

Protected variables apply only to protected branches (keep **`main`** protected).

### Stats cron (Worker secrets, not GitLab `VITE_*`)

Set on the **`ambik-web`** Worker via `wrangler secret put` (see [STATS.md](STATS.md)):

- `SUPABASE_URL` — same host as `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` — for daily waitlist aggregates only

When `apps/web/migrations/` changes, apply D1 from a machine logged in to Cloudflare (the GitLab API token may not include **D1 Edit**):

`cd apps/web && pnpm exec wrangler d1 migrations apply ambik-stats --remote`

### API token scope

Create a custom token with at least:

- Account → Workers Scripts → Edit  
- Account → Workers Builds → Edit (optional)  
- Zone → Workers Routes → Edit (for `ambik.link` zone, if required by your account)

## Pipeline behavior

| Event | Jobs |
|-------|------|
| Merge request | `lint_and_test` only |
| Push to `main` | `lint_and_test` → **`deploy_production`** (automatic) |

Monitor runs under **Build → Pipelines** and **Deploy → Environments → production**.

## Do not double-deploy

Use **either**:

1. **GitLab CI** (this repo — recommended for pipeline visibility), **or**
2. **Cloudflare Workers Builds** connected to the same GitLab repo,

not both on **`ambik-web`**, or every push will deploy twice.

If you previously connected GitLab under **Workers & Pages → ambik-web → Settings → Builds**, disconnect it and rely on GitLab CI only.

## Local deploy (emergency only)

```bash
pnpm install
pnpm turbo build --filter=@ambik/web
cd apps/web && pnpm exec wrangler deploy
```

Prefer fixing the pipeline and re-running **deploy_production** on `main`.
