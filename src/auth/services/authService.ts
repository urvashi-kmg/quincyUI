import { apiClient } from '@/lib/axiosClient';
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
export async function refreshTokens(
  refreshToken: string,
  userName?: string,
): Promise<RefreshedTokens> {
  const { data } = await apiClient.post<RefreshedTokens>('/auth/refresh', {
    refreshToken,
    userName,
  });
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
