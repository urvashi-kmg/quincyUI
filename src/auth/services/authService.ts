import { httpClient } from '@/lib/httpClient';
import type { Permission } from '../utils/permissions';

export interface AuthenticatedUser {
  id: string;
  displayName: string;
  email: string;
  permissions: Permission[];
}

export interface SessionResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

/**
 * Exchanges the httpOnly refresh cookie for a short-lived access token.
 * The login form itself is intentionally not implemented here — the identity
 * provider flow was not specified. See Rule Zero before adding one.
 */
export async function refreshSession(): Promise<SessionResponse> {
  const { data } = await httpClient.post<SessionResponse>('/auth/refresh');
  return data;
}

export async function logout(): Promise<void> {
  await httpClient.post('/auth/logout');
}
