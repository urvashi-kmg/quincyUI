import '@testing-library/jest-dom/vitest';
import { expect, afterEach, afterAll, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import { server } from '../../tests/mocks/server';

// jest-axe's `toHaveNoViolations` export is already a matchers map
// ({ toHaveNoViolations: fn }), not the matcher function itself — passing it
// as `{ toHaveNoViolations }` double-wraps it into
// { toHaveNoViolations: { toHaveNoViolations: fn } }, which vitest's
// expect.extend then tries to invoke as a function and fails with
// "expectAssertion.call is not a function". Spread it directly instead.
expect.extend(toHaveNoViolations);

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
