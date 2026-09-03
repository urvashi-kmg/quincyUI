import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from '@store/index';
import { initMonitoring } from '@config/monitoring';
import { env } from '@config/env';

import { App } from './App';
import { AuthProvider } from './providers/AuthProvider';

import '@styles/index.css';

initMonitoring();

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element #root not found');
}

function renderApp() {
  createRoot(container!).render(
    <StrictMode>
      <ReduxProvider store={store}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ReduxProvider>
    </StrictMode>,
  );
}

// Mocks are opt-in via VITE_ENABLE_MOCKS so a real gateway is never
// silently shadowed in staging/production builds. The worker must be
// running before the first request fires, so rendering waits on it here.
if (env.enableMocks) {
  import('@/mocks/browser').then(({ worker }) =>
    worker.start({ onUnhandledRequest: 'bypass' }).then(renderApp),
  );
} else {
  renderApp();
}
