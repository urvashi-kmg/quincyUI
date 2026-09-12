# CLAUDE.md — Quincy-UI Frontend AI Development Contract

## Mission

Build Quincy-UI features quickly with AI assistance, without letting generated code become
architecture drift, styling sprawl, duplicated state, untested behavior, or a security/accessibility
regression. This file is read by the assistant at the start of every task, before any file is
touched.

## Stack (do not deviate without approval)

| Area                      | Choice                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Framework                 | React 18 + TypeScript, strict mode                                                                                        |
| Build                     | Vite                                                                                                                      |
| Routing                   | React Router, lazy-loaded route-level code splitting                                                                      |
| Styling                   | Tailwind CSS, driven by a semantic CSS-variable token layer in `src/index.css` (see [Styling policy](#styling-policy))    |
| Icons                     | `lucide-react` only                                                                                                       |
| Tables                    | AG Grid Enterprise (`ag-grid-react`) for any enterprise/data-heavy table                                                  |
| Charts                    | Recharts                                                                                                                  |
| Server state              | RTK Query (`createApi` + `axiosBaseQuery`) — the default for remote data fetching                                         |
| Client/UI state           | Redux Toolkit slices (`src/redux/*.ts`, `src/stores/*.ts`, feature `stores/*Slice.ts`) — no parallel state library        |
| Local/page state          | React hooks (`useState`) for state that doesn't need to be global                                                         |
| Local/page state          | React hooks (`useState`) for state that doesn't need to be global                                                         |
| Forms                     | Formik                                                                                                                    |
| Validation                | Yup, schema-first, wired to the Formik schema                                                                             |
| HTTP                      | Axios, only inside `src/lib/axiosClient.ts` / `src/services/**` — never called directly from components, hooks, or slices |
| Unit/component tests      | Vitest + React Testing Library                                                                                            |
| Component tests (browser) | Playwright CT (`tests/ct`)                                                                                                |
| E2E                       | Playwright (`tests/e2e`), network mocked with MSW/Playwright route mocks                                                  |
| Lint/format               | ESLint (strict TS, boundaries, jsx-a11y) + Prettier                                                                       |
| Git hooks                 | Husky + lint-staged, pre-commit only                                                                                      |
| Package manager           | npm (commit `package-lock.json`)                                                                                          |
| CI/CD                     | GitHub Actions (`.github/workflows/ci.yml`)                                                                               |
| Monitoring                | Sentry (runtime errors) + Monocart reporter (Playwright test reporting)                                                   |
| Theming                   | Single fixed light theme — custom token layer in `tailwind.config.js`                                                     |
| Deployment                | IIS, hardcoded to the `/POC13/` path (see [Deployment](#deployment-to-iis))                                               |

## Rule Zero — stop and ask, don't assume

1. If a task would touch a file outside the approved scope, **stop and ask first.** Writing the
   file and mentioning it afterward is a violation, not a shortcut.
2. If any requirement is unclear — error handling, permissions, which existing component/slice/
   service to reuse, a copy string, a status code — **ask before implementing.** Guessing,
   silently defaulting, and leaving `TODO` placeholders are all prohibited.
3. Raise every concern explicitly and classify it: `blocker`, `high`, `medium`, `low`. Blockers
   stop the work until resolved. Every item in
   [Known Deviations & Migration Debt](#known-deviations--migration-debt) and
   [Known Issues / Tech Debt](#known-issues--tech-debt) is a standing `medium` concern by default —
   raise it again at `high`/`blocker` if a task would touch it directly.
4. If a better approach exists than the one requested, say so with trade-offs, and let the
   developer decide. Do not silently substitute it.

## Mandatory per-task workflow

1. **Intake.** Restate the requested behavior, acceptance criteria, affected screens/routes, data
   needs, and definition of done.
2. **Repository reconnaissance.** Read this file, the relevant `.claude/rules/*.md`, the relevant
   `.claude/skills/*/SKILL.md`, and inspect: the nearest similar feature under `src/features/`,
   existing Redux slices and RTK Query APIs, existing services/`lib` wrappers, existing shared
   constants/types, existing Storybook stories, and existing tests. Do not edit code until this is
   done.
3. **Plan.** Produce a short plan: files to create/change, state shape (Redux slice vs. RTK Query
   endpoint vs. local state), API/service calls, Storybook changes, test cases (unit / CT / E2E),
   accessibility considerations, security/PII considerations, risks, and anything needing approval.
   If anything is ambiguous and could materially change architecture or behavior, ask before
   writing code.
4. **Contract check.** Verify existing component/service/slice/RTK Query endpoint/constant/design-
   token contracts before creating new ones. Reuse over recreate.
5. **Implement.** Smallest coherent change. HTTP calls only in `src/lib/axiosClient.ts` consumers
   (`src/services/**`, RTK Query `axiosBaseQuery`), state in Redux Toolkit slices or RTK Query,
   styling via semantic token classes (never raw Tailwind color/typography utilities, never inline
   `style={{}}`), UI aligned with Storybook and existing AG Grid/Recharts/Formik patterns.
6. **Test in the same change.** Unit tests (Vitest) for logic and reducers, component tests
   (Playwright CT or RTL) for interactive UI, E2E (Playwright) only for critical journeys, a11y
   checks for new/changed UI. Never defer tests to "later."
7. **Self-review.** Run `npm run lint`, `npm run typecheck` (or `npm run build`, which includes
   `tsc`), `npm run test`, Storybook a11y check, and relevant E2E/CT. Review the diff for
   architecture, security, and scope violations.
8. **Report.** See [End-of-session report](#end-of-session-report) below.

## Non-negotiable rules

- Do not invent a convention when an existing one can be discovered in the codebase.
- Do not silently change public component props, Redux slice shapes, RTK Query endpoint
  contracts, `lib/apiEndpoints.ts` paths, routes, environment/config values, or persisted data
  formats.
- Do not add an npm dependency when an existing one in this stack already covers the need. If a
  new dependency is genuinely required, explain why and get explicit approval first (guards
  against dependency/slopsquatting risk — unreviewed installs are a supply-chain decision). Review
  any new dependency for maintenance activity and correct spelling before installing.
- Do not upgrade unrelated packages during a feature change.
- Do not delete tests, stories, types, or validation merely to make a build pass.
- Do not weaken lint/type/test/security/accessibility rules to bypass a failure.
- Do not suppress an ESLint or axe accessibility violation without a documented reason inline.
- Do not use `any` in source files — banned by ESLint (`no-explicit-any: error`); only relaxed in
  `*.test.{ts,tsx}`, `*.spec.{ts,tsx}`, and `*.stories.tsx`. If a shape is genuinely unknown, model
  it explicitly and narrow it.
- Do not duplicate constants, routes, status strings, feature flags, design tokens, or API paths
  that already exist. New API endpoints go in `src/lib/apiEndpoints.ts` — nowhere else.
- Do not call `axios`/`fetch` from a component, hook, or Redux slice directly — only from
  `src/lib/axiosClient.ts` and its consumers (`src/services/**`, RTK Query base query), enforced by
  `no-restricted-imports`/`no-restricted-globals` in ESLint.
- Do not use inline `style={{}}` — enforced by `react/forbid-dom-props` in ESLint. Use the semantic
  token classes or a CSS Module for layout that's awkward as utilities.
- Do not use raw Tailwind color or typography utilities on brand-visible UI (e.g. `text-slate-900`,
  `bg-white`, `text-xs`, `text-lg font-semibold`). Use the semantic classes defined in
  `src/index.css` (`.text-body`, `.bg-surface`, `.text-heading-lg`, etc.). Layout/spacing/sizing/
  responsive utilities (`flex`, `gap-*`, `w-full`, `md:flex`, …) remain safe to use raw.
- Do not hardcode colors, spacing, or typography values that already exist as Tailwind tokens.
- Do not commit secrets, tokens, `.env`/config values, or customer/policyholder PII into source,
  logs, Sentry payloads, or AI prompts. Runtime config lives only in `public/config.json`, which is
  not committed.
- Do not trust client-side authorization/role/permission checks as a security boundary — they are
  UX only. The backend gateway is the real boundary.
- Do not use `dangerouslySetInnerHTML` without a reviewed sanitizer allow-list and an inline
  comment explaining why.
- Do not put anything sensitive behind a `VITE_`-prefixed env var — Vite inlines these into the
  public client bundle.
- Do not directly call `localStorage`/`sessionStorage` — go through the token-storage utilities in
  `src/auth/` so token handling stays centralized and auditable.
- Do not create catch-all folders (`misc`, `helpers2`, `new`) to avoid deciding ownership.
- Do not refactor unrelated code just because it looks imperfect.
- Do not edit generated code or vendor files.
- Do not commit test data or mock responses containing real user/policy information — use
  placeholders.
- Do not push directly to `main` — all work goes through feature branches and PRs; CI must pass.
  Current branch convention: `feature/*`, `fix/*`.
- Do not claim a command passed unless it was actually run and the output is shown.

## Architecture boundaries (see `src/` layout below and `.claude/skills/frontend-architecture`)

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
| `src/stores`                      | Additional Redux slices kept outside the main store folder, e.g. `uiSlice.ts` (global modals/drawers state). See [Known Deviations](#known-deviations--migration-debt) — this split from `src/redux` is a consolidation candidate, not a pattern to extend without asking.                                                                                                                                                                                    |
| `src/auth`                        | Authentication layer: `services/` (`authService` — login, refresh, SSO/`autoLogin`), `components/` (`LoginPage`, `AutoLoginPage`, logout modals), `utils/` (`tokenStorage` — the only sanctioned place that touches `localStorage`/`sessionStorage`).                                                                                                                                                                                                         |
| `src/lib`                         | Utilities and initialization: `config.ts` (`loadConfig()`/`getConfig()` for runtime API URLs), `apiEndpoints.ts` (all endpoint paths — the single place new endpoints are added), `axiosClient.ts` (`apiClient` setup: baseURL, interceptors, token injection — the only place allowed to construct an Axios instance), `rtkQueryBaseQuery.ts` (Axios-based `baseQuery` adapter for RTK Query).                                                               |
| `src/services`                    | Shared services and data shaping: `api.ts` (shared API helpers), `mockData.ts` / `mockDetailedData.ts` (dev mock data — see tech debt), `userManagementService.ts`, `policies.json` (sample data).                                                                                                                                                                                                                                                            |
| `src/hooks`                       | Cross-feature reusable hooks: `useModal.ts`, `useBreakpoint.ts`.                                                                                                                                                                                                                                                                                                                                                                                              |
| `src/utils`                       | Small pure functions: `formatters.ts`, `errorMessages.ts`, `endorsementDateValidation.ts`, `assetUrl.ts`, `cn.ts` (clsx wrapper), with `__tests__/` alongside. Not a dumping ground for business logic.                                                                                                                                                                                                                                                       |
| `src/types`                       | Shared TypeScript types/interfaces used across features (`index.ts`).                                                                                                                                                                                                                                                                                                                                                                                         |
| `src/data`                        | Static JSON/data for development/demo: `formOptions.ts`, `quote-form-dropdowns.json`, `quote-form-validation.json`, `ChangePolicyResponeUpdated.json`.                                                                                                                                                                                                                                                                                                        |
| `src/index.css` / Tailwind config | Design-token source of truth (see [Styling policy](#styling-policy)).                                                                                                                                                                                                                                                                                                                                                                                         |

## Shared constants & design tokens

- Search `src/types`, `src/lib/apiEndpoints.ts`, `src/index.css`, and the relevant feature's
  existing constants before creating a new one.
- A value local to one component stays local. A value likely reused app-wide is proposed as a
  shared constant/token and requires explicit developer approval before being added.
- Add new design-system patterns to `src/index.css` under `@layer components` _before_ using them
  elsewhere, and update `DESIGN_TOKENS.md` immediately in the same change.

## API / services policy

- All endpoint paths live in `src/lib/apiEndpoints.ts`, typed against `src/types` where the
  contract is shared.
- Components/hooks call an RTK Query endpoint (`createApi` + `axiosBaseQuery`) or a
  `src/services/**` function — never `axios`/`fetch` directly.
- Centralize auth headers, error normalization, and token injection in `src/lib/axiosClient.ts`.
  401 responses are currently caught by the axios interceptor and redirect to login (see
  [tech debt](#known-issues--tech-debt) re: proactive refresh).
- Handle loading / success / empty / partial / error states explicitly in the UI (AG Grid and
  Recharts consumers included). Use `src/utils/errorMessages.ts` for consistent user-facing text.
- Never log request bodies, auth headers, or PII (names, emails, policy numbers, VINs, license
  numbers, etc.). Scrub PII from any Sentry breadcrumb/context.

## Styling policy

- The token system in `src/index.css` (`:root`, RGB-tuple CSS variables) is the source of truth for
  color and typography. Tailwind utilities that reference raw colors or font sizes are not allowed
  on brand-visible UI — use the semantic classes (`.text-body`, `.bg-surface`, `.border-default`,
  `.text-heading-xl` / `-lg`, `.text-caption`, etc.) or the component patterns already defined under
  `@layer components` (`.btn-primary/secondary/danger`, `.input*`, `.card*`, `.table*`, `.badge*`).
- Safe raw utilities, no tokens required: layout (`flex`, `grid`, `justify-*`, `items-*`, `gap-*`),
  spacing (`mt-4`, `px-6`, `space-y-2`), sizing (`w-full`, `max-w-md`, `h-12`), responsive
  (`md:flex`, `lg:grid`, `hidden sm:block`), display (`hidden`, `block`, `inline-block`).
- Use a CSS Module (`Component.module.css`) only for layout that's genuinely awkward as utilities
  (complex grid areas, third-party override scoping).
- No inline `style` attributes. No CSS-in-JS (styled-components, emotion).
- Single fixed light theme today. The variable structure supports a dark-mode swap with no
  component changes, but do not add dark-mode values until explicitly approved.
- Responsive behavior: Tailwind breakpoints plus the `useBreakpoint()` hook for layout logic.

## Testing policy

| Layer         | Tool                                                             | Use for                                                                    |
| ------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Unit          | Vitest                                                           | Pure functions, Redux reducers/selectors, Yup schemas, utils               |
| Component     | Vitest + RTL, or Playwright CT for browser-dependent interaction | Component behavior, Formik form validation, AG Grid cell renderers         |
| Accessibility | `jest-axe` in component tests, Storybook a11y addon per story    | Keyboard operability, labels, contrast, roles                              |
| E2E           | Playwright + MSW/route mocks                                     | Critical user journeys only (login → create quote → submit, policy lookup) |
| Regression    | Same tools as above                                              | Every bug fix ships a regression test at the lowest sensible layer         |

Coverage thresholds are enforced in `vitest.config.ts` (statements/functions/lines 80%, branches
75%) and are a gap detector, not a vanity metric — prioritize risk-heavy branches over 100%.

## Security policy

- No secrets in source, config values, browser storage, or AI prompts. Runtime API URLs and keys
  come from `public/config.json` (not committed — created locally/at deploy time), loaded via
  `src/lib/config.ts`.
- Treat all external/API input as untrusted; validate with Yup at the boundary where it enters
  forms, and type-narrow API responses.
- `dangerouslySetInnerHTML` requires a reviewed sanitizer and a comment explaining why.
- Client-side route guards and permission checks (via `redux/selector.ts`) are UX affordances
  only — the backend gateway is the real boundary.
- Review any new dependency for maintenance activity and correct spelling before installing
  (defends against dependency/typosquatting risk).
- Token handling: see [Known Deviations](#known-deviations--migration-debt) — the current and
  target storage locations for access/refresh tokens disagree between prior docs and must be
  confirmed with the team before touching auth code.

## Known Deviations & Migration Debt

These are places where the aspirational governance contract and the as-built codebase disagreed.
Do not silently pick one — confirm with a developer before writing auth, token, or design-token
code, and flag it again as a `blocker` if a task touches these areas directly.

- **Token storage.** One source of truth says the access token must live only in an in-memory
  `auth/services/tokenStore.ts` and never in Redux or browser storage; the as-built app currently
  stores the access token in Redux, with the refresh token in `sessionStorage` via
  `auth/utils/tokenStorage.ts`. **Confirm which model is authoritative before changing anything in
  `src/auth` or `src/redux/authSlice.ts`.**
- **Design token location.** One source of truth says tokens live in `tailwind.config.js`; the
  as-built system defines them as CSS variables in `src/index.css` consumed through
  `@layer components` classes. This document treats `src/index.css` as current source of truth
  (see [Styling policy](#styling-policy)) since it matches the actual codebase, but confirm before
  adding new tokens in either location.
- **Dark mode intent.** One source of truth implies no dark-mode planning; the as-built token
  system is explicitly structured to support it via a variable swap. Don't add dark values without
  approval either way.
- **AppShell location.** One source of truth places the connected shell in `src/app`; the as-built
  repo places it in `src/layouts/shared/AppShell.tsx`. Treat `src/layouts/shared` as current.
- **State-fetching pattern.** One source of truth describes Redux Toolkit as the sole state
  mechanism; the as-built app uses RTK Query for async/remote data (quotes, tasks, notepad)
  alongside Redux Toolkit slices for UI state — and some legacy code mixes both for the same
  feature (see tech debt below). Prefer RTK Query for new remote-data work; ask before adding a new
  RTK Query API vs. a thunk-based slice.
- **AG Grid edition.** As-built uses AG Grid **Enterprise** specifically — check licensing/feature
  usage before adding new grid features that assume the Community edition.

## Known Issues / Tech Debt

Carried forward from the as-built documentation so the assistant doesn't "fix" these unprompted —
touching any of them without being asked is an unrelated refactor and requires approval.

1. **Legacy endpoints**: some old endpoints (e.g., `changePolicy` GET) are kept for backward
   compatibility; new code should use the POST variants.
2. **Multiple mock data files**: `mockData.ts`, `mockDetailedData.ts`, and various `*.json` files
   under `src/data/` overlap; consolidation would help clarity but is out of scope unless asked.
3. **Placeholder feature pages**: routes like `/notepad`, `/task-manager`, `/doc-manager` are
   stubs pending backend implementation.
4. **Redux slices mixed with RTK Query**: some async state is still managed via slices (e.g.,
   `notepadUiSlice`) alongside RTK Query for the same feature; unification would reduce
   boilerplate but is a planned migration, not an ad hoc one.
5. **Hardcoded IIS path**: `/POC13/` is hardcoded in `vite.config.ts`; making it configurable is
   tracked but not yet done.
6. **Auth token refresh**: currently reactive (axios interceptor catches 401 and redirects to
   login) rather than proactive; a proactive refresh would be more robust.

## Definition of done

- Meets stated acceptance criteria.
- Reuses existing components/services/slices/RTK Query endpoints/constants where they exist.
- Storybook story added/updated for any new/changed reusable UI (`src/components/ui`,
  `src/components/controls`), with the a11y addon clean.
- Tests added/updated at the appropriate layer(s) above.
- `npm run lint`, `npm run typecheck` (or `npm run build`), `npm run test` pass with real, shown
  output; `npm run test:ct` / `npm run test:e2e` run for affected flows.
- No inline styles, no raw Tailwind color/typography utilities on brand-visible UI, no raw
  `axios`/`fetch` outside `src/lib`/`src/services`, no direct `localStorage`/`sessionStorage` calls
  outside `src/auth`, no unauthorized new shared constant/token/dependency.
- No unused imports or variables; no console errors or warnings.
- No hardcoded API URLs, tokens, or env-specific config.
- Permission checks in place (via `redux/selector.ts`) if the feature touches user actions.
- Diff reviewed for unrelated changes.
- Commit message is clear and imperative, references the feature/bug.
- End-of-session report delivered.

## Approval gates — ask the developer before

- Creating a new shared constant/design token/config contract.
- Adding a new npm dependency.
- Changing a public component prop, Redux slice shape, RTK Query endpoint contract, or
  `apiEndpoints.ts` entry.
- Changing routing, auth, or permission behavior — including anything touching the
  [token-storage deviation](#known-deviations--migration-debt) above.
- Adding new global Redux state (in `src/redux` or `src/stores`) where local/feature state would do.
- Choosing RTK Query vs. a Redux Toolkit slice for new async state, where either could apply.
- Disabling or weakening a lint/type/test/security/accessibility rule.
- Touching anything listed under [Known Issues / Tech Debt](#known-issues--tech-debt) as part of a
  task that wasn't specifically asked to address it.
- Any refactor unrelated to the requested change.

## End-of-session report (goes in the PR description)

1. What changed, in plain language.
2. Every file changed, with path.
3. Questions asked and answers received.
4. Assumptions made (should be none, if Rule Zero was followed).
5. Tests added/updated, and the actual output of `npm run lint` / `npm run typecheck` / `npm run
test` / relevant CT or E2E run.
6. Accessibility status.
7. Security/PII considerations.
8. Anything left undone, and why.
9. Concerns raised, with severity (blocker/high/medium/low).
10. Follow-up or approval still required.

## Repository layout

```text
Quincy-UI/
├── .claude/
│   ├── rules/                     # eleven rule files, one per concern
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

## Deployment to IIS

**Prerequisites:**

- Build the app: `npm run build` (outputs to `dist/`)
- Deploy `dist/` to IIS, e.g. `C:\inetpub\wwwroot\QuincyUI`
- Run Windows PowerShell as Administrator on the IIS server

**Steps:**

1. Copy `deployment/fix-iis-site-root.ps1` to the IIS server.
2. Edit the script to set `$siteName` (IIS site name) and `$physPath` (deployed folder location).
3. Run as Administrator:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
   .\fix-iis-site-root.ps1
   ```
4. Verify: deep links to client-side routes (e.g. `/quotes/detail/123`) load without a 404 — the
   script registers the app as an IIS Application and sets `web.config` `httpErrors` fallback to
   `index.html`.

The path is currently hardcoded to `/POC13/` in `vite.config.ts` (see
[tech debt](#known-issues--tech-debt)).

## Useful commands

```bash
npm install
npm run dev              # Vite dev server (http://localhost:5173)
npm run lint
npm run typecheck        # or: npm run build (includes tsc)
npm run test             # Vitest unit/component, single run
npm run test:watch
npm run test:coverage
npm run test:ct          # Playwright component tests
npm run test:e2e         # Playwright E2E
npm run test:e2e:ui      # Playwright E2E with UI
npm run storybook
npm run build-storybook
npm run test:storybook   # axe over every story; requires a running/built Storybook
npm run build
npm run validate         # lint + typecheck + test + build, mirrors CI "quality" gate
```

Linting is strict: `max-warnings 0` — any warning fails the build.

## Common Tasks & Playbooks

### Adding a new feature page

1. Create the page component in `src/features/<feature>/pages/<FeaturePage>.tsx`.
2. Define the route in `src/app/routes.tsx`:
   ```typescript
   const MyPage = lazy(() => import('@/features/my/pages/MyPage').then(m => ({ default: m.MyPage })));
   // In Routes:
   <Route path="/my-path" element={<ErrorBoundary><MyPage /></ErrorBoundary>} />
   ```
3. Add sidebar navigation in `src/layouts/shared/Sidebar.tsx` (if user-facing).
4. Implement permission checks using `useSelector(selectMyPagePermissions)` from
   `redux/selector.ts` — never hardcode a permission check.
5. Add tests: Playwright CT for interactive components, `tests/e2e/my-feature.spec.ts` for the
   critical journey, Storybook story with a11y addon for new reusable UI.

### Adding a form

1. Define a Yup schema first (in the form component or a separate `useMyForm.ts` hook); derive
   form fields from it.
2. Wrap with Formik:
   ```typescript
   const formik = useFormik({
     initialValues: {/* ... */},
     validationSchema: mySchema,
     onSubmit: async (values) => {
       /* call API */
     },
   });
   ```
3. Use existing form controls from `src/components/controls/form/` (`<Input />`, `<Select />`,
   `<Button />`) rather than building new ones.
4. Pass error state from Formik to controls:
   `error={formik.touched.fieldName && formik.errors.fieldName}`.
5. Test with Playwright CT: fill the form, submit, verify validation and success state.

### Adding an API endpoint

1. Add the endpoint path to `src/lib/apiEndpoints.ts`:
   ```typescript
   getMyData: (id: string) => `/api/v1/MyFeature/GetData?id=${encodeURIComponent(id)}`;
   ```
2. Create an RTK Query API (preferred) or a `src/services/**` function using `apiClient`:
   ```typescript
   export const myApi = createApi({
     reducerPath: 'myApi',
     baseQuery: axiosBaseQuery(apiClient),
     endpoints: (builder) => ({
       getMyData: builder.query({ query: (id) => ({ url: apiEndpoints.getMyData(id) }) }),
     }),
   });
   export const { useGetMyDataQuery } = myApi;
   ```
3. Register in `src/redux/store.ts`:
   ```typescript
   [myApi.reducerPath]: myApi.reducer,
   // in middleware:
   myApi.middleware,
   ```
4. Use in components: `const { data, isLoading, error } = useGetMyDataQuery(id);`
5. Type the request/response against `src/types` where the contract is shared.

### Adding global state (Redux)

1. Create a slice in `src/redux/<feature>Slice.ts` (or a feature-local `stores/<feature>Slice.ts`
   if it's genuinely feature-scoped) — confirm with the developer before adding to `src/stores`,
   which is a legacy split (see [tech debt](#known-deviations--migration-debt)).
2. Define initial state, reducers, and selectors:
   ```typescript
   const mySlice = createSlice({
     name: 'myFeature',
     initialState: {/* ... */},
     reducers: {/* ... */},
   });
   ```
3. Register in `src/redux/store.ts`.
4. Export selectors for use in components.
5. Dispatch actions from components as needed. Prefer RTK Query over a hand-rolled thunk slice for
   remote/async data — ask if it's unclear which fits.

### Writing tests

**Unit test (Vitest):**

```typescript
import { describe, it, expect } from 'vitest';
import { myUtility } from '@/utils/myUtility';

describe('myUtility', () => {
  it('should format dates correctly', () => {
    expect(myUtility('2026-01-15')).toBe('January 15, 2026');
  });
});
```

**Component test (Playwright CT):**

```typescript
import { test, expect } from '@playwright/experimental-ct-react';
import { MyForm } from '@/features/my/components/MyForm';

test('should submit the form', async ({ mount }) => {
  const component = await mount(<MyForm />);
  await component.locator('input[name="name"]').fill('John Doe');
  await component.locator('button:has-text("Submit")').click();
  // Assert success state
});
```

**E2E test (Playwright):**

```typescript
import { test, expect } from '@playwright/test';

test('user can create a quote', async ({ page }) => {
  await page.goto('http://localhost:5173/quotes');
  await page.click('button:has-text("New Quote")');
  // Fill out form, submit, assert results
});
```

## Coding standards reference

- **TypeScript**: strict mode on; no unused vars/params (prefix `_` to suppress intentionally);
  `@/` alias resolves to `src/`.
- **React**: functional components only; hooks for state/effects; avoid `useEffect` chains where
  possible; `memo()`/`useMemo()`/`useCallback()` for stable props/expensive computation; a
  component, its hook, and its context provider may co-locate in one file
  (`react-refresh/only-export-components` is off for this reason); avoid re-exporting a component
  and its hook from the same index file.
- **Naming**: PascalCase for component files and React components; camelCase for utility files,
  variables, and functions; `UPPER_SNAKE_CASE` for constants; Tailwind classes lowercase-hyphenated.
- **Patterns to avoid**: direct DOM manipulation (refs only for browser APIs like focus); global
  variables (use Redux/context); import-time side effects; `.env` files for API URLs (use
  `public/config.json` at runtime instead).

## Glossary

- **LOB**: Line of Business (insurance category, e.g., Commercial Auto, Personal Auto)
- **Insured**: The person or entity being insured on a policy
- **Agency**: The insurance agency/broker (user of this app)
- **Quote**: A preliminary rate estimate for insurance coverage (not yet bound)
- **Endorsement**: A change to an existing policy (adds/removes coverage, updates info)
- **Cancellation**: The termination of an active policy
- **Underwriter**: Employee who reviews and approves quotes
- **Premium**: The cost of insurance coverage
- **RMV**: Registry of Motor Vehicles (used for driver validation)
- **VIN**: Vehicle Identification Number
- **RTK Query**: Redux Toolkit Query — async data fetching and caching library
- **SPA**: Single Page Application (routing happens client-side)
