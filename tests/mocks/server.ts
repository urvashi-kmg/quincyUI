import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/** Used by Vitest component tests that need network mocking beyond the unit layer. */
export const server = setupServer(...handlers);
