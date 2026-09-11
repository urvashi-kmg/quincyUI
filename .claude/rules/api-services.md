# Rule: API / Services Layer (Axios)

- All HTTP calls live in a service file. Cross-feature services go in `src/services/**`;
  feature-specific ones go in `src/features/<name>/services/**` (e.g.
  `features/quotes/services/quotesService.ts`). Auth calls go in `src/auth/services/**`.
- Those three paths plus `src/lib/httpClient.ts` are the **only** files permitted to import
  `axios`, enforced by the `no-restricted-imports` override list in `.eslintrc.cjs`. Adding a new
  path to that override list is an approval-gated change.
- `src/lib/httpClient.ts` owns the shared Axios instance: base URL, auth header injection, error
  normalization, and interceptors. Domain services import this instance rather than creating their
  own.
- Components, hooks, and Redux slices never call `fetch`/`axios` directly (`no-restricted-globals`
  blocks bare `fetch`). They call a service function, typically wrapped in a Redux Toolkit
  `createAsyncThunk` for anything that needs loading/error state in the store.
- Define explicit TypeScript request/response types, in `src/types` if shared across features or
  colocated with the service if feature-specific.
- Handle `loading`, `success`, `empty`, `partial`, and `error` states explicitly in the UI — do not
  assume a response always has data.
- Never log request bodies, auth headers, or response payloads containing policyholder personal
  data. Scrub before any Sentry breadcrumb.
- The access token is read from `src/auth/services/tokenStore.ts` (in memory) by the request
  interceptor. Do not reintroduce `localStorage`/`sessionStorage` token reads — see
  `.claude/rules/security.md`.
- Do not create a new service function if an existing one already covers the endpoint/shape;
  extend its options instead.
- When an API contract changes, find and update every consumer (services, slices, components,
  MSW mocks, tests) in the same change.
