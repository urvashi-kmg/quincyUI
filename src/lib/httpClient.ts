import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/auth/services/tokenStore';

/**
 * The single Axios instance for the whole app. Only src/services/**,
 * src/features/**\/services/**, and this file may import axios — see
 * .claude/rules/api-services.md.
 */
export function createHttpClient(): AxiosInstance {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // refresh token travels as an httpOnly cookie
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Normalize errors here. Never log the request body or auth header —
      // see .claude/rules/security.md.
      const normalized = {
        status: error.response?.status ?? 0,
        message: error.response?.data?.message ?? error.message ?? 'Unknown request error',
        code: error.response?.data?.code,
      };
      return Promise.reject(normalized);
    },
  );

  return client;
}

export const httpClient = createHttpClient();
