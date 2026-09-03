import { apiClient } from './apiClient';

// Wrapper for the QuincyGateway service boundary. Feature `services/*Api.ts`
// modules (RTK Query) should call through here rather than importing
// apiClient directly, so gateway-specific concerns (base path, versioning,
// downstream service routing headers) stay in one place.
const GATEWAY_PREFIX = '/POC13/QuincyGateway';

export const gatewayClient = {
  get: <T>(path: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(`${GATEWAY_PREFIX}${path}`, { params }).then((r) => r.data),

  post: <T, B = unknown>(path: string, body?: B) =>
    apiClient.post<T>(`${GATEWAY_PREFIX}${path}`, body).then((r) => r.data),

  put: <T, B = unknown>(path: string, body?: B) =>
    apiClient.put<T>(`${GATEWAY_PREFIX}${path}`, body).then((r) => r.data),

  delete: <T>(path: string) => apiClient.delete<T>(`${GATEWAY_PREFIX}${path}`).then((r) => r.data),
};
