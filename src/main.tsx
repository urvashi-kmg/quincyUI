import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initSentry } from '@/lib/sentry';
import { loadConfig } from '@/lib/config';
import { initApiClient } from '@/lib/axiosClient';
import { store } from '@/redux/store';
import { initializeAuthAsync } from '@/auth/stores/authSlice';
import '@/styles/index.css';

initSentry();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

/**
 * Config must be loaded (and apiClient's baseURL/API key set) before any
 * auth or feature request fires, and the boot-time auth check (default-login
 * only — see authSlice.ts's initializeAuthAsync) must resolve before the
 * router first renders, so RequireAuth's redirect decision isn't made against
 * a still-loading auth state.
 */
const root = createRoot(rootElement);

async function bootstrap(): Promise<void> {
  await loadConfig();
  initApiClient();
  await store.dispatch(initializeAuthAsync());

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
