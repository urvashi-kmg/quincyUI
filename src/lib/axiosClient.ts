/**
 * Configured axios instance for authenticated API calls.
 *
 * initApiClient() must be called from bootstrap() after loadConfig() resolves.
 * It sets the baseURL and re-attaches any stored Bearer token.
 *
 * Request interceptor: injects X-Api-Key and tracing headers; rejects a
 * non-auth request outright if a Bearer token is absent.
 *
 * Response interceptor: silently refreshes an expired token on 401 and
 * replays the original request. Concurrent 401s are queued so only one
 * refresh call is ever in-flight at a time.
 */

import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getConfig } from '@/lib/config';
import { tokenStorage } from '@/auth/utils/tokenStorage';
import { refreshTokens } from '@/auth/services/authService';
import { getErrorMessage } from '@/utils/errorMessages';

// ── Client instance ────────────────────────────────────────────────────────
// baseURL defaults to the same '/api' fallback used before config.json-driven
// bootstrap existed, so local `vite dev` keeps working; initApiClient() overrides
// it with the real gateway URL once loadConfig() resolves.

export type { AxiosRequestConfig };

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
  },
});

/**
 * Set the baseURL and re-attach any stored Bearer token.
 * Call once from bootstrap(), after loadConfig() and before ReactDOM.render.
 */
export function initApiClient(): void {
  apiClient.defaults.baseURL = getConfig().apiBaseUrl;
  const stored = tokenStorage.getAccessToken();
  if (stored) setAuthHeader(stored);
}

export function setAuthHeader(token: string): void {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function clearAuthHeader(): void {
  delete apiClient.defaults.headers.common['Authorization'];
}

// ── Token refresh state ────────────────────────────────────────────────────
// Ensures concurrent 401s only trigger one refresh call; others queue up and
// reuse the new token once it arrives.

let _isRefreshing = false;
let _refreshQueue: Array<(token: string) => void> = [];

function _drainQueue(token: string): void {
  _refreshQueue.forEach((cb) => cb(token));
  _refreshQueue = [];
}

function _clearSession(message?: string): void {
  tokenStorage.clearTokens();
  clearAuthHeader();

  // Store logout message in session storage so App.tsx can show it as a toast
  if (message) {
    sessionStorage.setItem('_auth_logout_message', message);
  }

  // Deliberately no navigation here: there is currently no login route/page
  // to send the user to (see docs/adr/0002-access-token-in-memory-only.md),
  // and router.tsx doesn't gate '/' on auth state — redirecting to root would
  // just re-trigger this same "no Authorization header" rejection on the next
  // dashboard fetch, looping. The caller's rejected promise is left to surface
  // an error in the UI instead.
}

// ── Request interceptor ────────────────────────────────────────────────────

const AUTH_URL_FRAGMENTS = [
  'registerandassignrole',
  '/auth/refresh',
  'internalautologin',
  'authorize-token',
];

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return AUTH_URL_FRAGMENTS.some((fragment) => lower.includes(fragment));
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

apiClient.interceptors.request.use((req) => {
  if (!isAuthEndpoint(req.url) && !apiClient.defaults.headers.common['Authorization']) {
    _clearSession('Your session has expired. Please log in again.');
    return Promise.reject(new Error('No active session.'));
  }

  req.headers['X-Correlation-Id'] = generateUuid();
  req.headers['X-Request-Id'] = generateUuid();

  if (!req.headers['X-Api-Key']) {
    try {
      const { apiXKey } = getConfig();
      if (apiXKey) req.headers['X-Api-Key'] = apiXKey;
    } catch {
      // getConfig() throws until loadConfig() resolves (e.g. in tests, which
      // never call it) — X-Api-Key is optional, so just proceed without it.
    }
  }

  return req;
});

/**
 * TEMPORARY (2026-07) — the Notepad LIST query endpoint's pagination isn't
 * deployed on the main gateway yet. When config.json's notepadListTempBaseUrl
 * is set, this points ONLY that one call at a DB2 test server instead:
 *
 *   apiClient.post(API_ENDPOINTS.queryNotepad, body, notepadListRequestConfig())
 *
 * Falls back to a no-op ({}) — i.e. the normal apiBaseUrl/apiXKey — when
 * notepadListTempBaseUrl is empty, so reverting once the gateway ships
 * pagination is just clearing that field (and notepadListTempApiKey) in
 * config.json. No other code changes needed.
 */
export function notepadListRequestConfig(): { baseURL?: string; headers?: Record<string, string> } {
  const { notepadListTempBaseUrl, notepadListTempApiKey } = getConfig();
  if (!notepadListTempBaseUrl) return {};
  return {
    baseURL: notepadListTempBaseUrl,
    headers: notepadListTempApiKey ? { 'X-Api-Key': notepadListTempApiKey } : {},
  };
}

// ── Response interceptor ───────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Never intercept 401s from auth endpoints — those are not an expired
    // session, so the refresh machinery doesn't apply.
    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint(original.url)) {
      const storedRefresh = tokenStorage.getRefreshToken();

      if (!storedRefresh) {
        _clearSession('Your session has expired. Please log in again.');
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }

      // Queue concurrent 401s; resolve them once the refresh completes.
      if (_isRefreshing) {
        return new Promise<string>((resolve) => {
          _refreshQueue.push(resolve);
        }).then((newToken) => {
          original.headers['Authorization'] = `Bearer ${newToken}`;
          return apiClient(original);
        });
      }

      original._retry = true;
      _isRefreshing = true;

      try {
        const tokens = await refreshTokens(storedRefresh, tokenStorage.getUserName() ?? undefined);
        tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
        setAuthHeader(tokens.accessToken);
        _drainQueue(tokens.accessToken);
        original.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
        return apiClient(original);
      } catch {
        _clearSession('Your session has expired. Please log in again.');
        return Promise.reject(new Error('Your session has expired. Please log in again.'));
      } finally {
        _isRefreshing = false;
      }
    }

    // Normalise all other errors into plain Error objects, but keep the
    // original HTTP status attached (e.g. notepadStore.ts's loadPage() needs
    // to distinguish a 404 "no more pages" from any other failure) — it
    // would otherwise be lost once the AxiosError is replaced below.
    // Also preserve an RFC 7807 problem-details body's `errors` dictionary
    // (field name -> message[]) and fall back to `title` for the summary
    // message — ASP.NET model-validation responses put the human-readable
    // text there, not in `message`. Some endpoints (e.g. Task Manager) use a
    // flatter envelope instead — `{ success, message, errorMessage, errorCode,
    // data }` — where the specific text lives in `errorMessage`, not `errors`;
    // preserve that too so callers can prefer it.
    const body = error.response?.data as Record<string, unknown> | undefined;
    const rawMessage =
      (body?.message as string | undefined) ??
      (body?.title as string | undefined) ??
      error.message ??
      'An unexpected error occurred';
    const errors = body?.errors as Record<string, string[]> | undefined;
    const errorMessage = body?.errorMessage as string | undefined;
    const status = error.response?.status;

    // Create error with status attached
    const errorObj = Object.assign(new Error(rawMessage), { status, errors, errorMessage });

    // Get user-friendly message
    const { message: friendlyMessage } = getErrorMessage(errorObj);

    // Return error with both raw and friendly messages
    return Promise.reject(
      Object.assign(new Error(friendlyMessage), { status, errors, errorMessage, rawMessage }),
    );
  },
);
