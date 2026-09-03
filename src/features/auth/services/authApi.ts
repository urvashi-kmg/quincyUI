import { gatewayClient } from '@services/gatewayClient';
import type { Credentials, User } from '../types';

// Plain async functions (not RTK Query) since auth is a one-off login/logout
// flow rather than cached, re-fetchable "server state" — RTK Query is used
// for quotes/policies where list/detail caching actually pays off.
export const authApi = {
  login: (credentials: Credentials) =>
    gatewayClient.post<{ user: User; token: string }>('/auth/login', credentials),
  logout: () => gatewayClient.post<void>('/auth/logout'),
  me: () => gatewayClient.get<User>('/auth/me'),
};
