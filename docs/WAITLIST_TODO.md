# Waitlist follow-ups

## Cloudflare Turnstile (shelved)

**Status:** Not in the UI. Waitlist is email + honeypot + client validation + Supabase RLS only.

**Why shelved:** Widget showed “Unable to connect to Cloudflare” (hostname / network / iframe). Sign-ups should work without blocking users on CAPTCHA.

### When re-enabling

1. [Turnstile dashboard](https://dash.cloudflare.com/?to=/:account/turnstile) — widget hostnames: `ambik.link`, `localhost`, `127.0.0.1`.
2. GitLab CI: `VITE_CF_TURNSTILE_SITE_KEY` (and optionally `TURNSTILE_SECRET` if adding server verify).
3. Code: `WaitlistForm.tsx` — use `import { Turnstile } from 'react-turnstile'` (not default import).
4. Require token before submit; reset widget after success.
5. **Recommended:** `POST /api/waitlist` on the Worker with [siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) instead of client-only gating.

`react-turnstile` remains in `apps/web/package.json` for when this ships.
