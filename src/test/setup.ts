import '@testing-library/jest-dom/vitest';
import { expect, afterEach, afterAll, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from 'jest-axe/matchers';
import { server } from '../../tests/mocks/server';

expect.extend(matchers);

// MSW: any component test that reaches the network gets the shared handlers
// from tests/mocks/handlers.ts. `onUnhandledRequest: 'error'` makes an
// unmocked call a test failure rather than a silent hang — see
// .claude/rules/testing.md.
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
