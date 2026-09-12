# Rule: API / Services Layer (Axios)

- All HTTP calls live in a service file. Cross-feature services go in `src/services/**`;
  feature-specific ones go in `src/features/<name>/services/**` (e.g.
  `features/quotes/services/quotesService.ts`). Auth calls go in `src/auth/services/**`.
- Those three paths plus `src/lib/axiosClient.ts` are the **only** files permitted to import
  `axios`, enforced by the `no-restricted-imports` override list in `.eslintrc.cjs`. Adding a new
  path to that override list is an approval-gated change.
- `src/lib/axiosClient.ts` owns the shared Axios instance (`apiClient`): base URL (set by
  `initApiClient()`), auth header injection, error normalization, and interceptors. Domain services
  import this instance rather than creating their own.
- Components, hooks, and Redux slices never call `fetch`/`axios` directly (`no-restricted-globals`
  blocks bare `fetch`). They call a service function, typically wrapped in a Redux Toolkit
  `createAsyncThunk` for anything that needs loading/error state in the store.
- `src/lib/config.ts` is the one permitted exception to the no-raw-`fetch` rule (see its
  `no-restricted-globals: 'off'` override in `.eslintrc.cjs`). It loads `public/config.json` at
  bootstrap to determine `apiBaseUrl`/`apiXKey`, which necessarily runs before
  `src/lib/axiosClient.ts`'s `apiClient` can be constructed — it is not a backend API call and
  cannot go through the services layer. Adding another file to this override is still an
  approval-gated change, same as the axios override list above.
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
