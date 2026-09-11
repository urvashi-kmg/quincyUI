/**
 * In-memory access token store.
 *
 * Deliberately NOT localStorage/sessionStorage: `.claude/rules/security.md`
 * prohibits persisting tokens in browser storage unless the security
 * architecture explicitly requires it. The refresh token is expected to live in
 * an httpOnly cookie issued by the backend, so a full page reload recovers the
 * session via `/auth/refresh` rather than by reading a token off disk.
 *
 * Trade-off, stated explicitly: a hard reload costs one refresh round-trip.
 * That is the intended behavior, not a bug to "fix" by reintroducing storage.
 */
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}
