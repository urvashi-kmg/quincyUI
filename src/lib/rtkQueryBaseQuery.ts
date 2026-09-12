/**
 * RTK Query baseQuery adapter over the shared `apiClient` axios instance.
 *
 * Reusing apiClient (instead of RTK Query's default fetchBaseQuery) means every
 * RTK Query endpoint built on this automatically gets the same auth headers,
 * X-Api-Key/correlation-id injection, and 401-refresh-and-replay behavior as
 * the rest of the app (see src/lib/axiosClient.ts) — nothing to re-implement.
 */
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { apiClient, type AxiosRequestConfig } from '@/lib/axiosClient';

export interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: unknown;
  params?: unknown;
  /** Per-call overrides (e.g. notepadListRequestConfig()'s temporary baseURL/apiKey) */
  config?: AxiosRequestConfig;
}

export interface AxiosBaseQueryError {
  status?: number;
  message: string;
  errors?: Record<string, string[]>;
  errorMessage?: string;
}

export function axiosBaseQuery(): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> {
  return async ({ url, method = 'get', data, params, config }) => {
    try {
      const result = await apiClient.request({ url, method, data, params, ...config });
      return { data: result.data };
    } catch (err) {
      // axiosClient's response interceptor already normalises AxiosErrors into
      // plain Errors with .status/.errors/.errorMessage/.rawMessage attached.
      const e = err as Error & { status?: number; errors?: Record<string, string[]>; errorMessage?: string };
      return {
        error: {
          status: e.status,
          message: e.message,
          errors: e.errors,
          errorMessage: e.errorMessage,
        },
      };
    }
  };
}
