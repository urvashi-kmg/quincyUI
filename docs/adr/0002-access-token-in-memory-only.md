# ADR 0002: Hold the access token in memory only

## Status
Accepted

## Context
`.claude/rules/security.md` prohibits persisting tokens in `localStorage`/`sessionStorage` unless
the security architecture explicitly requires it. An early draft of the shared Axios client read
the bearer token from `sessionStorage`, which contradicted that rule — tokens in web storage are
readable by any script that achieves execution on the page, so an XSS foothold becomes a token
theft.

## Decision
Both the access token and the refresh token live in a module-scoped store,
`src/auth/utils/tokenStorage.ts`. Neither is ever written to browser storage or placed in the
Redux store (which would also expose them via devtools and any state serialization).
`POST /auth/refresh` takes the in-memory refresh token explicitly (no cookie involved —
`src/lib/axiosClient.ts`'s `apiClient` does not set `withCredentials`) and returns a fresh pair,
which `axiosClient.ts`'s response interceptor uses to transparently retry a request that came back
401.

**Update (2026-09):** an earlier version of this ADR held the refresh token in an httpOnly cookie
instead of in memory. That model is superseded — see `.claude/rules/security.md`'s prohibition on
custom auth mechanisms without sign-off if reintroducing cookie-based refresh.

**Open item (2026-09):** the manual email/password login page/form that used to obtain the initial
token pair (`POST /auth/login`) was removed. Nothing currently calls `apiClient` with no prior
token except the (also currently unwired) SSO `autoLoginUrl`/`defaultLogin` path described in
`src/lib/config.ts` — until that's wired up, there is no way to establish a session in this app.

## Consequences
- An XSS foothold can still call the API as the user while the page is open. Because the refresh
  token is now also in memory (not behind `httpOnly`), an XSS foothold that runs while the page is
  open can read it too — this is a weaker guarantee than the original cookie-based design, traded
  for not depending on the backend to issue/manage a refresh cookie. Revisit if that trade-off is
  not acceptable for an environment handling real customer data.
- Neither token survives a hard reload or a new tab — there is no persistence mechanism at all.
  This is the intended trade-off; do not "optimize" it by caching either token to disk.
- No CSRF concern remains from this flow specifically, since no cookie is involved — the tokens
  travel only as an explicit `Authorization` header / request body.
