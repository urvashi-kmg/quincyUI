/**
 * In-memory session token store used by src/lib/axiosClient.ts.
 *
 * Deliberately NOT localStorage/sessionStorage: `.claude/rules/security.md` prohibits
 * persisting tokens in browser storage. Both the access token and the refresh token live
 * only in this module-scoped state, never in the Redux store (which would expose them via
 * devtools and state serialization) and never on disk — see
 * docs/adr/0002-access-token-in-memory-only.md.
 *
 * Trade-off, stated explicitly: because nothing is persisted, a hard reload always loses the
 * session and requires signing in again. That is the intended behavior, not a bug to "fix" by
 * reintroducing storage or a cookie.
 */
let accessToken: string | null = null;
let refreshToken: string | null = null;
let userName: string | null = null;

function getAccessToken(): string | null {
  return accessToken;
}

function getRefreshToken(): string | null {
  return refreshToken;
}

function getUserName(): string | null {
  return userName;
}

function setTokens(newAccessToken: string, newRefreshToken: string, newUserName?: string): void {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
  if (newUserName) userName = newUserName;
}

function clearTokens(): void {
  accessToken = null;
  refreshToken = null;
  userName = null;
}

export const tokenStorage = {
  getAccessToken,
  getRefreshToken,
  getUserName,
  setTokens,
  clearTokens,
};
