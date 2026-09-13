// jest-axe ships no type declarations of its own and there is no
// @types/jest-axe compatible with v9 — this repo types it locally against
// axe-core (already an installed transitive dependency of jest-axe) instead
// of adding a new package. Shape matches node_modules/jest-axe/index.js.
declare module 'jest-axe' {
  import type { AxeResults, ElementContext, RunOptions } from 'axe-core';

  export function axe(html: ElementContext, options?: RunOptions): Promise<AxeResults>;

  export function configureAxe(options?: RunOptions & { globalOptions?: RunOptions }): typeof axe;

  export const toHaveNoViolations: {
    toHaveNoViolations(results: AxeResults): { pass: boolean; message: () => string };
  };
}
