# ADR 0002: Hold the access token in memory only

## Status
Accepted

## Context
`.claude/rules/security.md` prohibits persisting tokens in `localStorage`/`sessionStorage` unless
the security architecture explicitly requires it. An early draft of
`src/lib/httpClient.ts` read the bearer token from `sessionStorage`, which contradicted that rule —
tokens in web storage are readable by any script that achieves execution on the page, so an XSS
foothold becomes a token theft.

## Decision
The access token lives in a module-scoped variable in `src/auth/services/tokenStore.ts`. It is
never written to browser storage and never placed in the Redux store (which would also expose it
via devtools and any state serialization). Session continuity across a page reload comes from a
long-lived refresh token in an httpOnly, `Secure`, `SameSite` cookie issued by the backend, which
`POST /auth/refresh` exchanges for a fresh access token. `httpClient` is configured with
`withCredentials: true` so that cookie is sent.

## Consequences
- An XSS foothold can still call the API as the user while the page is open, but cannot exfiltrate
  a durable credential. This is a meaningful reduction, not elimination.
- A hard reload costs one `/auth/refresh` round-trip before the first data request. This is the
  intended trade-off; do not "optimize" it by caching the token to disk.
- The backend must set the refresh cookie and support the refresh/logout endpoints. Until it does,
  session restore will fail closed (the user is treated as signed out).
- CSRF becomes relevant because a cookie is now involved: the refresh endpoint needs CSRF
  protection (`SameSite=Strict` plus a token check). **Open item — confirm with the backend team
  before enabling auth in an environment that handles real customer data.**
