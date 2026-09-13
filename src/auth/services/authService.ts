import { apiClient } from '@/lib/axiosClient';
import { getConfig } from '@/lib/config';
import { API_ENDPOINTS } from '@/lib/apiEndpoints';
import type { Permission } from '../utils/permissions';

export interface AuthenticatedUser {
  id: string;
  displayName: string;
  email: string;
  permissions: Permission[];
}

export interface RefreshedTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Exchanges the in-memory refresh token for a fresh access token. Called by
 * axiosClient.ts's response interceptor when a request comes back 401.
 */
export async function refreshTokens(refreshToken: string, userName?: string): Promise<RefreshedTokens> {
  const { data } = await apiClient.post<RefreshedTokens>('/auth/refresh', { refreshToken, userName });
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

interface RawTokenResponse {
  accessToken?: string;
  refreshToken?: string;
}

function toRefreshedTokens(data: RawTokenResponse, failureMessage: string): RefreshedTokens {
  const accessToken = data.accessToken?.trim() ?? '';
  const refreshToken = data.refreshToken?.trim() ?? '';
  if (!accessToken || !refreshToken) throw new Error(failureMessage);
  return { accessToken, refreshToken };
}

/**
 * Credential login (user id + password).
 *
 * ASSUMPTION (flagged, unverified against a live backend): the endpoint path
 * `/auth/login` is taken from docs/adr/0002-access-token-in-memory-only.md,
 * which documents this exact app's now-removed login page as having called
 * `POST /auth/login` — consistent with the sibling `/auth/refresh`/`/auth/logout`
 * endpoints already implemented here. The source project's equivalent
 * (`E:\Quincy-UI`) instead POSTs a full URL to `${apiBaseUrl}/api/v1/Auth/login`;
 * that path was NOT used here since it belongs to a different frontend's
 * config, and `/auth/login` matches this codebase's own documented history.
 * The request body/headers below are ported from the source project as-is,
 * since no other contract is documented for this destination. Confirm both
 * choices against the real backend before relying on this in production.
 */
export async function login(userId: string, password: string): Promise<RefreshedTokens> {
  const { data } = await apiClient.post<RawTokenResponse>(
    '/auth/login',
    { username: userId, password, firstName: '', lastName: '', mobile: '', oid: '', auth_type: 'db' },
    { headers: { 'X-Request-UId': userId } },
  );
  return toRefreshedTokens(data, 'No access token received from authentication server.');
}

/**
 * SSO auto-login: exchanges a one-time opaque key for a session token pair.
 * The key is sent in the POST body (never the URL/query string) so it never
 * appears in server access logs. The frontend never inspects the key itself
 * — the backend is solely responsible for validating it.
 */
export async function autoLogin(key: string): Promise<RefreshedTokens> {
  const { autoLoginUrl } = getConfig();
  if (!autoLoginUrl) throw new Error('Auto-login URL is not configured in config.json.');
  const { data } = await apiClient.post<RawTokenResponse>(autoLoginUrl, { key });
  return toRefreshedTokens(data, 'No access token received from server.');
}

/**
 * Fetches the signed-in user's profile/permissions after a successful
 * login/autoLogin/default-login.
 *
 * ASSUMPTION (flagged, unverified): this backend response shape isn't
 * documented anywhere in this repo. Modeled narrowly here rather than as
 * `any`; confirm the real shape (and adjust `toAuthenticatedUser` below)
 * once the endpoint can be checked against a live backend.
 */
export interface UserInfoResponse {
  userId?: string;
  displayName?: string;
  email?: string;
  permissions?: string[];
}

export async function fetchUserInfo(userId: string): Promise<UserInfoResponse> {
  const { data } = await apiClient.get<UserInfoResponse>(API_ENDPOINTS.getUserInfo(userId));
  return data;
}
