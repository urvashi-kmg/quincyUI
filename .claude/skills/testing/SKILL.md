---
name: testing
description: Ship Vitest, Playwright CT, and Playwright E2E tests alongside Quincy-UI implementation, prioritizing user-visible behavior.
---

# Testing Skill

## Purpose
Ship tests with implementation across the three layers Quincy-UI uses: Vitest (unit/component),
Playwright CT (browser component tests), Playwright E2E (critical journeys).

## Rules
- Write/update tests during implementation, not afterward — see `.claude/rules/testing.md`.
- Test behavior via accessible queries (`getByRole`, `getByLabelText`), not implementation
  details or CSS class selectors.
- Redux: test reducers/selectors as pure functions; test connected components through their
  rendered behavior, not by inspecting dispatched action internals.
- Formik + Yup: test validation behavior (submitting invalid data shows the right error,
  submitting valid data calls the right handler), not Formik's internals.
- AG Grid: test via rendered rows/cells and grid API events a user would trigger (sort, filter,
  select), not internal grid state.
- Every bug fix includes a regression test at the lowest layer that would have caught it.
- Cover happy path plus loading, empty, error, validation, and permission/boundary states.
- Reserve Playwright E2E for a small set of critical journeys; mock the network with MSW/route
  interception so E2E never depends on a live backend.
- Treat the coverage thresholds in `vitest.config.ts` as a signal for missing risk coverage, not
  the only quality metric.
