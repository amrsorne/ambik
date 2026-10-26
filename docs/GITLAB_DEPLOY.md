# GitLab CI → Cloudflare Worker (`ambik-web`)

Production deploys run from **GitLab pipelines** (not manual `wrangler deploy` on your laptop). Each push to **`main`** runs tests, then **`wrangler deploy`** to the existing Worker **`ambik-web`** (custom domain **ambik.link** is already attached in Cloudflare).

## One-time GitLab setup

Project: [gitlab.com/ameersorne/ideas/ambik/ambik](https://gitlab.com/ameersorne/ideas/ambik/ambik)

Go to **Settings → CI/CD → Variables** and add:

| Variable | Masked | Protected | Notes |
|----------|--------|-----------|--------|
| `CLOUDFLARE_API_TOKEN` | yes | yes | [Edit Cloudflare Workers](https://developers.cloudflare.com/workers/ci-cd/external-cicd/gitlab-cicd/) permission on your account |
| `CLOUDFLARE_ACCOUNT_ID` | no | yes | Account ID (same account as `ambik.link` zone) |
| `VITE_SUPABASE_URL` | yes | yes | Same values as v1 Pages project |
| `VITE_SUPABASE_ANON_KEY` | yes | yes | Public anon key |
| `VITE_CF_TURNSTILE_SITE_KEY` | yes | yes | Turnstile site key |

Protected variables apply only to protected branches (keep **`main`** protected).

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
