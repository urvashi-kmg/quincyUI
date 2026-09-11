# Deployment notes

Quincy-UI builds to a static bundle (`npm run build` -> `dist/`) served behind a CDN/reverse proxy
that owns the security headers below. The app itself sets no headers - configure these at the
hosting layer.

## Required response headers

- `Content-Security-Policy` — restrict `default-src 'self'`; allow the Sentry ingest origin and
  the configured `VITE_API_BASE_URL` origin explicitly; no `unsafe-inline` for scripts.
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (or `frame-ancestors 'none'` in CSP)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` on the production domain.

## Environments

| Env          | `VITE_APP_ENV` | Notes                                                                   |
| ------------ | -------------- | ----------------------------------------------------------------------- |
| Local        | `development`  | `npm run dev`, mocked APIs via MSW where the backend isn't reachable    |
| Preview (PR) | `preview`      | Built in CI, deployed per-PR, Sentry environment tagged                 |
| Production   | `production`   | `npm run build`, immutable asset hashing, Sentry release tagged from CI |

## Config

All runtime config is via `VITE_*` env vars (see `.env.example`). Nothing sensitive may live in a
`VITE_*` var — see `.claude/rules/security.md`. Server-side secrets (if any backend-for-frontend
proxy is added later) belong outside this repo.
