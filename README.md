# Ambik v2

Side-project hub for [ambik.link](https://ambik.link) — pnpm monorepo with Turborepo, TanStack Start on Cloudflare Workers, and shared project catalog.

## Structure

- `apps/web` — apex site (hub UI + path redirects)
- `packages/catalog` — project links, cards, and redirect resolver (replaces v1 Pages Functions)

## Requirements

- Node.js 22+
- pnpm 10 (`corepack enable`)

## Local development

```bash
pnpm install
cp apps/web/.env.example apps/web/.dev.vars
# Fill VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_CF_TURNSTILE_SITE_KEY

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Path redirects (`/mybajet` → `mybajet.ambik.link`) apply when the request hostname is `ambik.link`. For local testing, use preview deploy or temporarily set hostname via Workers preview URL.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start `apps/web` dev server |
| `pnpm build` | Build all packages |
| `pnpm test` | Run catalog redirect tests |
| `pnpm deploy` | Build and `wrangler deploy` web app |

## Cloudflare cutover (replace v1 Pages on ambik.link)

1. Deploy to Workers preview: `pnpm deploy` (or GitLab manual **deploy_production** job).
2. Verify on `*.workers.dev`: home page, `/mybajet` 301, `/assets/*` not redirected.
3. In Cloudflare dashboard, attach custom domain **ambik.link** (and **www** if used) to Worker **ambik-web**.
4. Remove **ambik.link** from the old Pages project (defaulter) so only the Worker serves apex.
5. Set production secrets/vars: Supabase and Turnstile keys (same names as v1 `VITE_*`).

### GitLab CI variables

- `CLOUDFLARE_API_TOKEN` — Workers deploy token
- `CLOUDFLARE_ACCOUNT_ID` — optional if wrangler cannot infer account

## License

MIT — Side project by Ameer Sorne.
