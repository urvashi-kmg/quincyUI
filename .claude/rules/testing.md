# Rule: Testing (Vitest + Playwright CT + Playwright E2E)

- Tests are written/updated in the same change as the implementation — never deferred.
- **Unit (Vitest):** pure functions, Yup schemas, Redux reducers/selectors, utils. Fast,
  deterministic, no real network (use MSW handlers from `tests/mocks` if a unit test needs one).
- **Component (Vitest + RTL, or Playwright CT for browser-dependent behavior):** user-visible
  component behavior — form validation via Formik+Yup, AG Grid cell rendering/sorting, Popup
  open/close, chart rendering with sample data. Prefer accessible queries (`getByRole`,
  `getByLabelText`) over test IDs.
- **Accessibility:** `jest-axe` in component tests, Storybook a11y addon per story — covers
  keyboard operability, labels, contrast, roles. See `accessibility.md`.
- **E2E (Playwright, `tests/e2e`):** only critical journeys (login, create a quote, view a policy,
  submit an endorsement). Network is mocked via MSW or Playwright route interception — never hits
  a live backend in CI.
- Every bug fix ships a regression test at the lowest layer that would have caught it.
- Cover happy path plus loading, empty, error, and permission/boundary states for anything
  data-driven.
- Do not delete or weaken a test to make a build pass — fix the code or, if the test is genuinely
  wrong, say so explicitly and get approval to change it.
- Do not rely on snapshot-only tests as the sole coverage for interactive behavior.
- Coverage thresholds live in `vitest.config.ts` (80% statements/functions/lines, 75% branches) —
  treat them as a gap detector, not a target to game with trivial tests; prioritize risk-heavy
  branches over 100%.
- Never report a test/command as passed without having actually run it and shown the output.
