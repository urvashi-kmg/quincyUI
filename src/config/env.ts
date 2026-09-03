// Central, typed access to Vite env vars. Never read import.meta.env directly
// elsewhere — add new vars here so a missing/misnamed var fails at build/boot
// time, not deep inside a feature.
interface EnvConfig {
  apiBaseUrl: string;
  sentryDsn: string | undefined;
  environment: 'development' | 'test' | 'staging' | 'production';
  enableMocks: boolean;
}

function required(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  apiBaseUrl: required('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  environment: (import.meta.env.VITE_ENVIRONMENT as EnvConfig['environment']) ?? 'development',
  enableMocks: import.meta.env.VITE_ENABLE_MOCKS === 'true',
};
