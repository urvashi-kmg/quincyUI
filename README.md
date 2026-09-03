# Quincy UI

Insurance-domain front end. React 18 + TypeScript on Vite, feature-sliced architecture.

## Stack

| Area | Choice |
|---|---|
| Framework | React 18 + TypeScript, Vite |
| Routing | React Router v6, route-level code splitting via `lazy()` |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| Tables | AG Grid Community |
| Charts | Recharts |
| Server state | Redux Toolkit (RTK Query) |
| Client / local UI state | Redux Toolkit — a feature-namespaced slice even for local-only state (see `features/quotes/stores`) |
| Cross-feature state | Redux Toolkit slices (e.g. `features/auth`) |
| Forms | Formik + Yup |
| HTTP | Axios, single instance with interceptors (`src/services/apiClient.ts`) |
| Unit/integration tests | Vitest + React Testing Library + MSW |
| Component tests | Playwright CT |
| E2E tests | Playwright (route-level mocking) |
| Lint/format | ESLint (flat config, strict TS, a11y) + Prettier |
| Git hooks | Husky + lint-staged |
| CI/CD | GitHub Actions |
| Monitoring | Sentry (errors/perf) + Monocart/JUnit reporters for test results |

## Getting started

> This project was scaffolded in an environment without npm registry access,
> so `node_modules` was never installed here — do that first, on a machine
> with network access:

```bash
npm install
cp .env.example .env.local   # set VITE_API_BASE_URL at minimum
npm run msw:init             # one-time: generates public/mockServiceWorker.js
npm run prepare              # activates husky hooks
npm run dev
```

### Local login (mocked)

There's no real auth backend wired up yet. With `VITE_ENABLE_MOCKS=true`
(the default in `.env.example`), MSW intercepts `/auth/login` in the
browser — see `src/mocks/handlers/auth.handlers.ts` — so you can sign in
with:

```
Email:    test@quincy.dev
Password: password123
```

Set `VITE_ENABLE_MOCKS=false` once a real gateway is available; the mock
worker never starts and every request goes to `VITE_API_BASE_URL` as normal.

## Scripts

```bash
npm run dev            # start dev server
npm run build           # typecheck + production build
npm run lint             # eslint
npm run typecheck    # tsc --noEmit
npm run test              # vitest (unit/integration, MSW-mocked)
npm run test:ct           # Playwright component tests (real browser)
npm run test:e2e          # Playwright E2E against a built preview server
npm run format            # prettier --write
```

## Architecture notes

- **Feature-sliced.** Each domain module under `src/features/*` owns its
  components, pages, hooks, services, local state, and types. Other code
  must import a feature only through its `index.ts` barrel — enforced by
  an ESLint `no-restricted-imports` rule — so features stay swappable and
  dependency direction stays obvious in review.
- **Redux Toolkit is the single state tool, used at two different scopes.**
  Server data (quotes, policies) uses RTK Query for caching/invalidation.
  Local, feature-only UI state (the quote wizard's current step and draft)
  is still a Redux Toolkit slice — namespaced under its own reducer key
  (`quoteWizard`) and only ever touched through that feature's own hook, so
  it behaves like local state to every consumer even though it's technically
  in the global store. Genuinely cross-feature state (auth) is a slice too.
  See `src/features/quotes/stores/quoteWizardSlice.ts` +
  `src/features/quotes/hooks/useQuoteWizard.ts` (local-scoped pattern) next
  to `src/features/auth/stores/authSlice.ts` (cross-feature pattern).
- **API layer.** `src/services/apiClient.ts` is the one Axios instance
  (auth header, correlation ID, 401 handling). `src/services/gatewayClient.ts`
  wraps it for the `/POC13/QuincyGateway` boundary. RTK Query endpoints call
  through `gatewayClient`, not `fetch` or a second Axios instance, so every
  request gets the same interceptor behavior.
- **Mocking is layered on purpose.** MSW mocks the network for Vitest
  unit/integration tests and can optionally run in local dev
  (`src/mocks/`). Playwright E2E uses its own `page.route()` interception
  instead — it's simpler for full-page navigation flows and needs no
  extra runtime bundled into the app.
- **Code splitting** happens at two levels: route-level via `React.lazy()`
  in `app/routes.tsx`, and vendor-level via `manualChunks` in
  `vite.config.ts` (AG Grid and Recharts are large and shouldn't dilute
  every route's chunk just because one page uses them).

## What still needs a decision from the team

- **`claims`, `customers`, `billing`, `underwriting`, `documents`,
  `notifications`, `renewals`** are scaffolded (folder + barrel export +
  README) but not implemented — build them out following the `quotes`
  pattern.
- **Sentry vs. an in-house APM** — Sentry is wired in `src/config/monitoring.ts`
  but gated behind `VITE_SENTRY_DSN`; if the org already standardizes on
  something else, swap it there.
- **Auth token storage** currently uses `sessionStorage`; confirm this
  matches your security review (vs. httpOnly cookies issued by the gateway).
- **No dark/light mode.** The `ThemeProvider` and the `dark:` variant classes
  have been removed; `tailwind.config.ts` no longer sets `darkMode`. The
  `brand` / `signal` / `surface` color tokens in `tailwind.config.ts` are
  still there as a starting palette — replace them with your own design
  system's values (or add the same keys with your own hex codes) and every
  component that references `bg-brand-700`, `text-signal-red`, etc. will
  pick up the new colors automatically.
