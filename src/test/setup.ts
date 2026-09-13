import '@testing-library/jest-dom/vitest';
import { expect, afterEach, afterAll, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import { server } from '../../tests/mocks/server';

// Pre-existing bug fix, unrelated to the design system change: jest-axe 9.x
// exports `toHaveNoViolations` from its main entry, not a `jest-axe/matchers`
// subpath (which doesn't exist in this version) — this import was failing
// for every test file in the repo, not just ones touched here.
//
// `toHaveNoViolations` is already the matchers map jest-axe expects
// `expect.extend` to receive directly (`{ toHaveNoViolations: matcherFn }`);
// wrapping it in another `{ toHaveNoViolations }` registered a matcher whose
// value was that map instead of a function, so every axe assertion in the
// repo failed at runtime with "expectAssertion.call is not a function".
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
