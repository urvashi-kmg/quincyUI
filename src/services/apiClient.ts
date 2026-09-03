import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { env } from '@config/env';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = sessionStorage.getItem('quincy-access-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Correlation id for tracing a request across gateway + downstream policy/claims services.
  config.headers['X-Correlation-Id'] = crypto.randomUUID();
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    const message = error.response?.data?.message ?? error.message ?? 'Unexpected API error';
    return Promise.reject(new Error(message));
  },
);
