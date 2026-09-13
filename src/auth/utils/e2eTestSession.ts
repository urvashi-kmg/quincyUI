import { tokenStorage } from '@/auth/utils/tokenStorage';
import { setAuthHeader } from '@/lib/axiosClient';

export interface E2EAuthSeed {
  accessToken: string;
  refreshToken: string;
  userName?: string;
}

declare global {
  interface Window {
    __E2E_AUTH__?: E2EAuthSeed;
  }
}

/**
 * E2E-only session seed. tests/e2e specs inject `window.__E2E_AUTH__` via
 * Playwright's page.addInitScript() before the app boots; this reads it and
 * seeds tokenStorage + the axios Authorization header directly, standing in
 * for the real login/SSO flow that doesn't exist yet (see
 * docs/adr/0002-access-token-in-memory-only.md, "Open item").
 *
 * Only called from main.tsx when import.meta.env.MODE === 'e2e' — a mode no
 * production build ever uses (`vite build` defaults to 'production'), so this
 * never runs outside a Playwright-driven build.
 */
export function wireE2ESession(): void {
  const seed = window.__E2E_AUTH__;
  if (!seed) return;
  tokenStorage.setTokens(seed.accessToken, seed.refreshToken, seed.userName);
  setAuthHeader(seed.accessToken);
}
