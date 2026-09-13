/**
 * Client-side JWT claim reading — for DISPLAY only (e.g. resolving a username
 * to show in the UI or to key a follow-up profile lookup after SSO). Never
 * use these to make an authorization decision — the backend is the only
 * trust boundary (`.claude/rules/security.md`).
 */

interface JwtPayload {
  exp?: number;
  preferred_username?: string;
  unique_name?: string;
  upn?: string;
  sub?: string;
  email?: string;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(atob(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

/** True if the token is expired or expires within 30s, or can't be decoded. */
export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return Date.now() / 1000 > payload.exp - 30;
}

/** Best-effort username from common claim names; null if none are present. */
export function getUsernameFromJwt(token: string): string | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  return payload.preferred_username ?? payload.unique_name ?? payload.upn ?? payload.sub ?? payload.email ?? null;
}
