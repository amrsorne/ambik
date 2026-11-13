# Waitlist — Ambik Supabase only

Waitlist sign-ups from [ambik.link](https://ambik.link) must use the **Ambik** Supabase project, not MyTeam FC.

## Verify the correct project

| Project | Ref (URL host) | Use |
|---------|----------------|-----|
| **Ambik** | `yaxvexccccbftxxjmozs` | Yes — matches `VITE_SUPABASE_URL` in GitLab CI and `apps/web/.dev.vars` |
| MyTeam FC | `pvzygsqpwtloukjiangz` | **No** — do not point env vars or run migrations here |

Before any SQL change: open Supabase **Project Settings → General** and confirm the reference ID.

## Apply database hardening

1. Open the Ambik project in the [Supabase dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor → New query**.
3. Paste and run [`docs/sql/waitlist_hardening.sql`](sql/waitlist_hardening.sql).
4. Confirm **Table Editor → waitlist** still accepts a test insert from the app (after RLS policies are applied).

## Environment variables (GitLab + local)

Documented in [GITLAB_DEPLOY.md](GITLAB_DEPLOY.md):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CF_TURNSTILE_SITE_KEY`

Turnstile is validated **in the browser only**; abuse resistance relies on RLS, uniqueness, and the insert throttle trigger in SQL.

## Client behavior

- **Live** cards (status line contains “live”): open project link only.
- **Non-live** cards: waitlist form (email, Turnstile, Join) even when a project URL exists.
