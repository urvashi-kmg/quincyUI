import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initSentry } from '@/lib/sentry';
import { wireE2ESession } from '@/auth/utils/e2eTestSession';
import '@/styles/index.css';

initSentry();

// Never true in a production build (`vite build` defaults to mode 'production') —
// only the E2E webServer builds with --mode e2e. See e2eTestSession.ts.
if (import.meta.env.MODE === 'e2e') {
  wireE2ESession();
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
