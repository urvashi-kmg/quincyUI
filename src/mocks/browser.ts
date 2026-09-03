import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

// Used only in local dev when VITE_ENABLE_MOCKS=true, and in Vitest for
// unit/integration tests. Playwright E2E uses its own route-level mocking
// (see tests/e2e) rather than this MSW worker.
export const worker = setupWorker(...handlers);
