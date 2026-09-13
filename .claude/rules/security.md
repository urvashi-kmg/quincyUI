# Rule: Security

- No secrets, API keys, tokens, or credentials in source, `.env` committed files, or logs. Runtime
  API URLs and keys come only from `public/config.json` (not committed — created locally/at
  deploy time), loaded via `src/lib/config.ts`.
- Anything prefixed `VITE_` is inlined into the public client bundle at build time — never put a
  secret behind a `VITE_*` variable.
- Treat all external input (API responses, URL params, user input) as untrusted; validate with Yup
  at form boundaries and narrow API response types before use.
- `dangerouslySetInnerHTML` is banned unless paired with a reviewed sanitizer allow-list and a
  comment explaining why raw HTML is unavoidable.
- Client-side route guards / role checks (`src/auth`, `redux/selector.ts`) are UX affordances
  only — the API/backend gateway is the actual authorization boundary. Never state or imply
  otherwise in UI copy.
- Do not persist tokens or policyholder PII in `localStorage`/`sessionStorage` unless the security
  architecture explicitly requires it; prefer memory/Redux state + httpOnly cookies via the backend
  where possible. **Token handling is an open discrepancy** — see `known-deviations.md` ("Token
  storage"): confirm which model is authoritative before changing anything in `src/auth` or
  `src/redux/authSlice.ts`.
- Never log request/response bodies, auth headers, or PII to the console or to Sentry. Scrub PII
  from Sentry `beforeSend` (`src/lib/sentry.ts`).
- New dependencies: verify the package exists, is correctly spelled, is actively maintained, and
  matches the real publisher before installing — defends against dependency/typosquatting risk
  (LLM-suggested package names are not automatically trustworthy). Requires explicit developer
  approval regardless.
- Keep `package-lock.json` authoritative; use `npm ci` in CI, not `npm install`.
- CSP and related security headers are enforced at the hosting layer — see `deployment.md`.
