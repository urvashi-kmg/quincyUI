// Registers jest-axe's matcher on vitest's own `expect` (extended at runtime
// in src/test/setup.ts) so `expect(await axe(...)).toHaveNoViolations()`
// type-checks across every test file. This file must itself be an ES module
// (hence the `export {}`) — augmenting an existing module's types only
// merges correctly from inside a real module; a global ambient script would
// instead replace vitest's whole type surface (see src/vite-env.d.ts's note).
export {};

interface JestAxeMatchers<R = unknown> {
  toHaveNoViolations: () => R;
}

declare module 'vitest' {
  // Empty interface bodies are how TS declaration merging attaches new
  // matcher members onto vitest's own `Assertion`/`AsymmetricMatchersContaining`
  // types (the standard vitest/jest custom-matcher augmentation pattern) —
  // there's no non-empty equivalent, so the lint rule's default reading
  // (interface adds nothing) doesn't apply here.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = unknown> extends JestAxeMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends JestAxeMatchers {}
}
