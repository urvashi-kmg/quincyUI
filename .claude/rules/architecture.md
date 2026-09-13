# Rule: Architecture Boundaries & Repository Layout

## Architecture boundaries (see `.claude/skills/frontend-architecture`)

This reflects the repository as it actually exists. If a task seems to require deviating from it,
that's a `blocker` under Rule Zero, not a judgment call.

| Layer                             | Responsibility                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app`                         | Bootstrap and routing: `App.tsx` (root render decision tree / auth state), `routes.tsx` (lazy-loaded route definitions, each wrapped in `<ErrorBoundary>` + `<Suspense>`), `main.tsx` (loads `public/config.json`, initializes auth, mounts React), `providers/` (Redux, Sidebar, Toast context setup).                                                                                                                                                       |
| `src/layouts`                     | App shell layout. `DashboardLayout` plus `shared/` (`AppShell`, `Header`, `Sidebar`, `ErrorBoundary`, `SidebarContext`). The connected shell lives here, not in `components/layout`, because it reads feature/auth state.                                                                                                                                                                                                                                     |
| `src/components`                  | Shared, feature-agnostic, presentational UI. `controls/` (form controls, `Tabs`, `YesNoToggle`), `ui/` (`Modal`, `Card`, `Badge`, `Toast`, `Popup`, icons, etc.), `NotFoundPage.tsx`. No feature-specific logic here.                                                                                                                                                                                                                                         |
| `src/features/<name>`             | One folder per business domain: `dashboard`, `quotes`, `policies`, `endorsements`, `renewals`, `settings`, `ai-assistant`, `notifications`, `notepad`, `task-manager`. Each may have its own `components/`, `pages/`, `services/`, `stores/`, `hooks/`, `types/`, `utils/`, `constants/`, `steps/`. Features should not import from sibling features' internals — share via `src/components`, `src/services`, `src/redux`, `src/lib`, or `src/types` instead. |
| `src/lobs/<name>`                 | Line-of-business plug-ins (`registry.ts`, `types.ts`), e.g. `mca` (Commercial Auto): `components`, `pages`, `routes`.                                                                                                                                                                                                                                                                                                                                         |
| `src/redux`                       | Global store: `store.ts` (`configureStore()` with all slices/APIs registered), `reducer.ts` (legacy generic reducer), `authSlice.ts` (auth state — `isAuthenticated`, tokens), `selector.ts` (permission/user selectors), `actions.ts`, `hooks.ts` (typed `useAppDispatch`/`useAppSelector`).                                                                                                                                                                 |
| `src/stores`                      | Additional Redux slices kept outside the main store folder, e.g. `uiSlice.ts` (global modals/drawers state). See [Known Deviations](known-deviations.md) — this split from `src/redux` is a consolidation candidate, not a pattern to extend without asking.                                                                                                                                                                                                  |
| `src/auth`                        | Authentication layer: `services/` (`authService` — login, refresh, SSO/`autoLogin`), `components/` (`LoginPage`, `AutoLoginPage`, logout modals), `utils/` (`tokenStorage` — the only sanctioned place that touches `localStorage`/`sessionStorage`).                                                                                                                                                                                                         |
| `src/lib`                         | Utilities and initialization: `config.ts` (`loadConfig()`/`getConfig()` for runtime API URLs), `apiEndpoints.ts` (all endpoint paths — the single place new endpoints are added), `axiosClient.ts` (`apiClient` setup: baseURL, interceptors, token injection — the only place allowed to construct an Axios instance), `rtkQueryBaseQuery.ts` (Axios-based `baseQuery` adapter for RTK Query).                                                               |
| `src/services`                    | Shared services and data shaping: `api.ts` (shared API helpers), `mockData.ts` / `mockDetailedData.ts` (dev mock data — see tech debt), `userManagementService.ts`, `policies.json` (sample data).                                                                                                                                                                                                                                                            |
| `src/hooks`                       | Cross-feature reusable hooks: `useModal.ts`, `useBreakpoint.ts`.                                                                                                                                                                                                                                                                                                                                                                                              |
| `src/utils`                       | Small pure functions: `formatters.ts`, `errorMessages.ts`, `endorsementDateValidation.ts`, `assetUrl.ts`, `cn.ts` (clsx wrapper), with `__tests__/` alongside. Not a dumping ground for business logic.                                                                                                                                                                                                                                                       |
| `src/types`                       | Shared TypeScript types/interfaces used across features (`index.ts`).                                                                                                                                                                                                                                                                                                                                                                                         |
| `src/data`                        | Static JSON/data for development/demo: `formOptions.ts`, `quote-form-dropdowns.json`, `quote-form-validation.json`, `ChangePolicyResponeUpdated.json`.                                                                                                                                                                                                                                                                                                        |
| `src/index.css` / Tailwind config | Design-token source of truth (see [Styling](styling.md)).                                                                                                                                                                                                                                                                                                                                                                                                     |

## Repository layout

```text
Quincy-UI/
├── .claude/
│   ├── rules/                     # rule files, one per concern, lazy-loaded from CLAUDE.md
│   └── skills/                    # SKILL.md per capability, read alongside rules
├── .github/workflows/              # CI (lint, typecheck, unit, build, storybook, e2e, ct)
├── .husky/                          # pre-commit -> lint-staged only
├── .storybook/
├── deployment/
│   └── fix-iis-site-root.ps1       # IIS deployment script
├── docs/
│   ├── prompts/                     # prompt templates
│   └── adr/                         # architecture decision records
├── public/
│   └── config.json                  # runtime config, gitignored, created locally/at deploy
├── src/
│   ├── app/
│   │   ├── App.tsx                  # root render decision tree; handles auth state + routing
│   │   ├── routes.tsx                # lazy-loaded route definitions, wrapped in ErrorBoundary
│   │   ├── main.tsx                  # bootstrap: config loading, auth init, React mount
│   │   └── providers/                # Redux, Sidebar, Toast context setup
│   ├── layouts/
│   │   ├── DashboardLayout.tsx
│   │   └── shared/                   # AppShell, Header, Sidebar, ErrorBoundary, SidebarContext
│   ├── auth/
│   │   ├── services/                 # authService: login, refresh, SSO (autoLogin)
│   │   ├── components/               # LoginPage, AutoLoginPage, LogoutModals
│   │   └── utils/                    # tokenStorage (localStorage/sessionStorage access)
│   ├── components/
│   │   ├── NotFoundPage.tsx
│   │   ├── controls/                 # form/, Tabs, YesNoToggle
│   │   └── ui/                       # Modal, Card, Badge, Toast, Popup, icons, etc.
│   ├── features/
│   │   ├── ai-assistant/{constants,hooks,pages,types}/
│   │   ├── dashboard/{components,data,pages,stores}/
│   │   ├── endorsements/{components,pages}/
│   │   ├── notifications/{components,services,stores}/
│   │   ├── notepad/{components,services,stores}/
│   │   ├── policies/{pages,stores}/
│   │   ├── quotes/{cancellation,components,services,steps,utils}/
│   │   ├── renewals/{pages}/
│   │   ├── settings/{components,data,pages}/
│   │   └── task-manager/{components,services,stores}/
│   ├── lobs/
│   │   ├── registry.ts
│   │   ├── types.ts
│   │   └── mca/{components,pages,routes}/       # Commercial Auto LOB
│   ├── redux/
│   │   ├── store.ts                  # configureStore() with all slices/APIs
│   │   ├── reducer.ts                # generic reducer (legacy)
│   │   ├── authSlice.ts              # auth state (isAuthenticated, tokens)
│   │   ├── selector.ts               # permission/user selectors
│   │   ├── actions.ts
│   │   └── hooks.ts                  # typed useAppDispatch/useAppSelector
│   ├── stores/
│   │   └── uiSlice.ts                # global UI state (modals, drawers) — outside src/redux
│   ├── lib/
│   │   ├── config.ts                 # loadConfig()/getConfig()
│   │   ├── apiEndpoints.ts           # all API endpoint paths
│   │   ├── axiosClient.ts            # apiClient: baseURL, interceptors, token injection
│   │   └── rtkQueryBaseQuery.ts      # Axios-based baseQuery adapter for RTK Query
│   ├── services/
│   │   ├── api.ts
│   │   ├── mockData.ts
│   │   ├── mockDetailedData.ts
│   │   ├── userManagementService.ts
│   │   └── policies.json
│   ├── hooks/
│   │   ├── useModal.ts
│   │   └── useBreakpoint.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── errorMessages.ts
│   │   ├── endorsementDateValidation.ts
│   │   ├── assetUrl.ts
│   │   ├── cn.ts
│   │   └── __tests__/
│   ├── types/
│   │   └── index.ts
│   ├── data/
│   │   ├── formOptions.ts
│   │   ├── quote-form-dropdowns.json
│   │   ├── quote-form-validation.json
│   │   └── ChangePolicyResponeUpdated.json
│   └── index.css                     # Tailwind entrypoint + design token variables
├── tests/{e2e,ct,mocks}/
├── skills/                            # signpost only; canonical skills are in .claude/skills
├── coverage/                           # generated, gitignored
├── CLAUDE.md
├── index.html
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── playwright-ct.config.ts
├── tailwind.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── .eslintrc.cjs
```
