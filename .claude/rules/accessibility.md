# Rule: Accessibility (WCAG 2.1 AA)

- `eslint-plugin-jsx-a11y` (strict config) runs at lint time — a11y lint errors are build-blocking,
  not advisory.
- Every interactive element has an accessible name (label, `aria-label`, or visible text).
- Keyboard operability and visible focus are required for every interactive element, including
  custom components in `src/components/ui` (Popup, DataGrid cell editors, custom Formik controls).
- Color is never the only signal (status chips, chart series, form errors need a text/icon
  companion).
- Contrast must meet 4.5:1 for normal text against the token backgrounds.
- Forms: every input has a associated `<label>` (via Formik field + `htmlFor`/`id`), and
  validation errors are associated to the field (`aria-describedby`) and announced.
- AG Grid and Recharts: verify keyboard navigation and screen-reader-reachable summaries where the
  library supports it; do not ship a chart/grid whose data is only conveyed visually without a
  fallback.
- New/changed reusable UI gets a Storybook story with the a11y addon enabled, and — for
  interactive components — a `jest-axe` assertion in its test.
- Do not suppress an axe/jsx-a11y violation without a comment documenting why the rule does not
  apply, and get that documented exception reviewed.
