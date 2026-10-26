# Ambik v2

Side-project hub for [ambik.link](https://ambik.link) — pnpm monorepo with Turborepo, TanStack Start on Cloudflare Workers, and shared project catalog.

**Deploys:** push to **`main`** on GitLab → CI runs tests → auto-deploys Worker **`ambik-web`**. See [docs/GITLAB_DEPLOY.md](docs/GITLAB_DEPLOY.md).

## Structure

- `apps/web` — apex site (hub UI + path redirects)
- `packages/catalog` — project links, cards, and redirect resolver (replaces v1 Pages Functions)

## Requirements

- Node.js 22+
- pnpm 10

## Local development

```bash
pnpm install
cp apps/web/.env.example apps/web/.dev.vars
# Fill VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_CF_TURNSTILE_SITE_KEY

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Path redirects (`/mybajet` → `mybajet.ambik.link`) apply when the request hostname is `ambik.link`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start `apps/web` dev server |
| `pnpm build` | Build all packages |
| `pnpm test` | Run catalog redirect tests |

Production deploy is via **GitLab CI** on `main`, not a root `pnpm deploy` in day-to-day workflow.

## License

MIT — Side project by Ameer Sorne.
