# Cloudflare cutover checklist (defaulter Pages → ambik Worker)

## Pre-flight

- [ ] Note old Pages project name and Git connection (defaulter repo).
- [ ] Export/list custom domains on Pages (`ambik.link`, `www.ambik.link` if any).
- [ ] Confirm Supabase + Turnstile env values match production.

## Preview deploy

- [ ] `pnpm install && pnpm turbo build test --filter=@ambik/catalog --filter=@ambik/web`
- [ ] `cd apps/web && pnpm exec wrangler deploy` (or GitLab manual job).
- [ ] Open `https://ambik-web.<account>.workers.dev/` — hub loads, 9 cards, EN/MY toggle.
- [ ] `GET /mybajet` → 301 → `https://mybajet.ambik.link`
- [ ] `GET /nakmasak` and `/nakmasakapa` → `https://nakmasak.ambik.link`
- [ ] `GET /assets/*` and `/*.js` → no redirect (app assets)

## Production domain

- [ ] Workers & Pages → **ambik-web** → Settings → Domains & Routes → add **ambik.link**.
- [ ] Remove **ambik.link** from legacy Pages project (or disable Pages builds).
- [ ] Wait for TLS; smoke-test production URLs above.

## Rollback

- Re-attach **ambik.link** to Pages project and redeploy defaulter if needed.
