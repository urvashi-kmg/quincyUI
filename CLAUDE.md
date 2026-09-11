# CLAUDE.md — Quincy-UI Frontend AI Development Contract

## Mission

Build Quincy-UI features quickly with AI assistance, without letting generated code become
architecture drift, styling sprawl, duplicated state, untested behavior, or a security/accessibility
regression. This file is read by the assistant at the start of every task, before any file is
touched.

## Stack (do not deviate without approval)

| Area | Choice |
|---|---|
| Framework | React 18 + TypeScript, strict mode |
| Build | Vite |
| Routing | React Router (lazy-loaded route-level code splitting) |
| Styling | Tailwind CSS (tokens in `tailwind.config.js`) + CSS Modules for complex/one-off layouts |
| Icons | `lucide-react` only |
| Tables | AG Grid (`ag-grid-react`) for any enterprise/data-heavy table |
| Charts | Recharts |
| Server state, client state, complex state | Redux Toolkit (`src/redux`, feature `stores/*Slice.ts`) — no parallel state library |
| Forms | Formik |
| Validation | Yup, wired to the Formik schema |
| HTTP | Axios, only inside `src/services/**` or `src/lib/httpClient.ts` |
| Unit/component tests | Vitest + React Testing Library |
| Component tests (browser) | Playwright CT (`tests/ct`) |
| E2E | Playwright (`tests/e2e`), network mocked with MSW/Playwright route mocks |
| Lint/format | ESLint (strict TS, boundaries, jsx-a11y) + Prettier |
| Git hooks | Husky + lint-staged, pre-commit only |
| Package manager | npm (commit `package-lock.json`) |
| CI/CD | GitHub Actions (`.github/workflows/ci.yml`) |
| Monitoring | Sentry (runtime errors) + Monocart reporter (Playwright test reporting) |
| Theming | Tailwind `darkMode: 'class'` + custom token layer in `tailwind.config.js` |

## Rule Zero — stop and ask, don't assume

1. If a task would touch a file outside the approved scope, **stop and ask first.** Writing the
   file and mentioning it afterward is a violation, not a shortcut.
2. If any requirement is unclear — error handling, permissions, which existing component/slice/
   service to reuse, a copy string, a status code — **ask before implementing.** Guessing,
   silently defaulting, and leaving `TODO` placeholders are all prohibited.
3. Raise every concern explicitly and classify it: `blocker`, `high`, `medium`, `low`. Blockers
   stop the work until resolved.
4. If a better approach exists than the one requested, say so with trade-offs, and let the
   developer decide. Do not silently substitute it.

## Mandatory per-task workflow

1. **Intake.** Restate the requested behavior, acceptance criteria, affected screens/routes, data
   needs, and definition of done.
2. **Repository reconnaissance.** Read this file, the relevant `.claude/rules/*.md`, the relevant
   `.claude/skills/*/SKILL.md`, and inspect: the nearest similar feature under `src/features/`,
   existing Redux slices, existing services, existing shared constants/types, existing Storybook
   stories, and existing tests. Do not edit code until this is done.
3. **Plan.** Produce a short plan: files to create/change, Redux state shape (if any), API/service
   calls, Storybook changes, test cases (unit / CT / E2E), accessibility considerations, security/
   PII considerations, risks, and anything needing approval. If anything is ambiguous and could
   materially change architecture or behavior, ask before writing code.
4. **Contract check.** Verify existing component/service/slice/constant/design-token contracts
   before creating new ones. Reuse over recreate.
5. **Implement.** Smallest coherent change. API logic in `src/services/**`, state in Redux Toolkit
   slices, styling in Tailwind classes or CSS Modules (never inline `style={{}}`), UI aligned with
   Storybook and existing AG Grid/Recharts/Formik patterns.
6. **Test in the same change.** Unit tests (Vitest) for logic and reducers, component tests
   (Playwright CT or RTL) for interactive UI, E2E (Playwright) only for critical journeys, a11y
   checks for new/changed UI. Never defer tests to "later."
7. **Self-review.** Run `npm run lint`, `npm run typecheck`, `npm run test`, Storybook a11y check,
   and relevant E2E/CT. Review the diff for architecture, security, and scope violations.
8. **Report.** See "End-of-session report" below.

## Non-negotiable rules

- Do not invent a convention when an existing one can be discovered in the codebase.
- Do not silently change public component props, Redux slice shapes, service contracts, routes,
  environment variables, or persisted data formats.
- Do not add an npm dependency when an existing one in this stack already covers the need. If a
  new dependency is genuinely required, explain why and get explicit approval first (guards
  against dependency/slopsquatting risk — unreviewed installs are a supply-chain decision).
- Do not upgrade unrelated packages during a feature change.
- Do not delete tests, stories, types, or validation merely to make a build pass.
- Do not weaken lint/type/test/security/accessibility rules to bypass a failure.
- Do not suppress an ESLint or axe accessibility violation without a documented reason inline.
- Do not use `any`; if the shape is genuinely unknown, model it explicitly and narrow it.
- Do not duplicate constants, routes, status strings, feature flags, design tokens, or API paths
  that already exist.
- Do not call `axios`/`fetch` from a component, hook, or Redux slice directly — only from
  `src/services/**` (enforced by `no-restricted-imports` / `no-restricted-globals` in ESLint).
- Do not use inline `style={{}}` — enforced by `react/forbid-dom-props` in ESLint. Use Tailwind
  classes or a CSS Module.
- Do not hardcode colors, spacing, or typography values that already exist as Tailwind tokens.
- Do not commit secrets, tokens, `.env` values, or customer/policyholder PII into source, logs,
  Sentry payloads, or AI prompts.
- Do not trust client-side authorization/role checks as a security boundary — they are UX only.
- Do not use `dangerouslySetInnerHTML` without a reviewed sanitizer allow-list.
- Do not put anything sensitive behind a `VITE_`-prefixed env var — Vite inlines these into the
  public client bundle.
- Do not create catch-all folders (`misc`, `helpers2`, `new`) to avoid deciding ownership.
- Do not refactor unrelated code just because it looks imperfect.
- Do not claim a command passed unless it was actually run and the output is shown.

## Architecture boundaries (see `src/` layout below and `.claude/skills/frontend-architecture`)

| Layer | Responsibility |
|---|---|
| `src/app` | Router, providers (Redux `Provider`, Sentry, error boundary), and the connected `AppShell`. The shell lives here rather than in `components/layout` because it reads feature state, which the `components` layer is not permitted to do. |
| `src/auth` | Auth flows, guards, permission helpers, and the in-memory token store. The access token is held in `auth/services/tokenStore.ts` only — never in browser storage and never in the Redux store. |
| `src/components/ui` | Reusable, presentational, design-system-aligned components (Button, Popup, icons, DataGrid wrapper). No feature-specific logic. |
| `src/components/layout` | Presentational layout primitives (`PageHeader`). Props-only, no feature state — the connected shell is in `src/app`. |
| `src/components/controls/form` | Formik-bound form controls (TextField, Select, DatePicker) shared across features. |
| `src/features/<name>` | One folder per business feature (dashboard, quotes, policies, endorsements, renewals, notifications, settings, ai-assistant). Each may have its own `components/`, `pages/`, `services/`, `stores/`, `hooks/`, `types/`, `utils/`, `constants/`, `steps/`. Features may import shared layers but should not import from sibling features' internals — share via `src/components`, `src/services`, `src/redux`, or `src/types` instead. |
| `src/redux` | Store setup (`store.ts`), root reducer composition, typed hooks (`useAppDispatch`/`useAppSelector`). Feature reducers live in `src/features/<name>/stores/` and are registered here. |
| `src/services` | Axios instance + all HTTP calls, grouped by domain. Only place allowed to import `axios`. |
| `src/hooks` | Cross-feature reusable hooks (`useTheme`, `useMediaQuery`, `useDebounce`). |
| `src/lib` | Thin wrappers around third-party SDKs (Sentry init, Axios instance factory). |
| `src/utils` | Small pure functions. Not a dumping ground for business logic. |
| `src/types` | Shared TypeScript types/interfaces used across features. |
| `src/styles` | Tailwind entrypoint (`index.css`), global CSS variables, theme tokens. |

## Shared constants & design tokens

- Search `src/types`, `tailwind.config.js`, and the relevant feature's existing constants before
  creating a new one.
- A value local to one component stays local. A value likely reused app-wide is proposed as a
  shared constant/token and requires explicit developer approval before being added.

## API / services policy

- All endpoint paths and request/response types live in `src/services/**`, typed against
  `src/types` where the contract is shared.
- Components/hooks call a service function or a Redux Toolkit `createAsyncThunk`/RTK Query
  endpoint — never `axios`/`fetch` directly.
- Centralize auth headers, error normalization, and retry/backoff in `src/lib/httpClient.ts`.
- Handle loading / success / empty / partial / error states explicitly in the UI (AG Grid and
  Recharts consumers included).
- Never log request bodies, auth headers, or PII. Scrub PII from any Sentry breadcrumb/context.

## Styling policy

- Tailwind utility classes are the default. Use a CSS Module (`Component.module.css`) only for
  layout that is awkward as utilities (complex grid areas, third-party override scoping).
- No inline `style` attributes.
- Use the token layer in `tailwind.config.js` (`brand`, `surface`, `muted`, `border`) rather than
  raw hex values or default Tailwind palette classes for anything brand-visible.
- Dark mode is `class`-based (`useTheme` toggles `document.documentElement.classList`). Every new
  component must be checked in both themes.

## Testing policy

| Layer | Tool | Use for |
|---|---|---|
| Unit | Vitest | Pure functions, Redux reducers/selectors, Yup schemas, utils |
| Component | Vitest + RTL, or Playwright CT for browser-dependent interaction | Component behavior, Formik form validation, AG Grid cell renderers |
| Accessibility | `jest-axe` in component tests, Storybook a11y addon per story | Keyboard operability, labels, contrast, roles |
| E2E | Playwright + MSW/route mocks | Critical user journeys only (quote creation, policy lookup, login) |
| Regression | Same tools as above | Every bug fix ships a regression test at the lowest sensible layer |

Coverage thresholds are enforced in `vitest.config.ts` (statements/functions/lines 80%, branches
75%) and are a gap detector, not a vanity metric — prioritize risk-heavy branches over 100%.

## Security policy

- No secrets in source, `VITE_*` env vars, browser storage, or AI prompts.
- Treat all external/API input as untrusted; validate with Yup at the boundary where it enters
  forms, and type-narrow API responses.
- `dangerouslySetInnerHTML` requires a reviewed sanitizer and a comment explaining why.
- Client-side route guards and role checks are UX affordances only — the API is the real boundary.
- Review any new dependency for maintenance activity and correct spelling before installing
  (defends against dependency/typosquatting risk).
- Enforce CSP headers at the hosting layer (see `deployment/`).

## Definition of done

- Meets stated acceptance criteria.
- Reuses existing components/services/slices/constants where they exist.
- Storybook story added/updated for any new/changed reusable UI.
- Tests added/updated at the appropriate layer(s) above.
- `npm run lint`, `npm run typecheck`, `npm run test`, and (for UI changes) Storybook a11y checks
  pass with real, shown output.
- No inline styles, no raw `axios`/`fetch` outside `src/services`, no unauthorized new shared
  constant/token/dependency.
- Diff reviewed for unrelated changes.
- End-of-session report delivered.

## Approval gates — ask the developer before

- Creating a new shared constant/design token/config contract.
- Adding a new npm dependency.
- Changing a public component prop, Redux slice shape, or service contract.
- Changing routing, auth, or permission behavior.
- Adding new global Redux state where local/feature state would do.
- Disabling or weakening a lint/type/test/security/accessibility rule.
- Any refactor unrelated to the requested change.

## End-of-session report (goes in the PR description)

1. What changed, in plain language.
2. Every file changed, with path.
3. Questions asked and answers received.
4. Assumptions made (should be none, if Rule Zero was followed).
5. Tests added/updated, and the actual output of `npm run test` / `npm run lint` / `npm run
   typecheck` / relevant E2E or CT run.
6. Accessibility status.
7. Security/PII considerations.
8. Anything left undone, and why.
9. Concerns raised, with severity.
10. Follow-up or approval still required.

## Repository layout

```text
Quincy-UI/
├── .claude/
│   ├── rules/            # eleven rule files, one per concern
│   └── skills/            # SKILL.md per capability, read alongside rules
├── .github/workflows/     # CI (lint, typecheck, unit, build, storybook, e2e, ct)
├── .husky/                 # pre-commit -> lint-staged only
├── .storybook/
├── deployment/
├── docs/
│   ├── prompts/            # seven prompt templates
│   └── adr/                # architecture decision records
├── public/
├── src/
│   ├── app/{AppShell.tsx,router.tsx,providers/}
│   ├── auth/{components,services,stores,utils}/
│   ├── components/
│   │   ├── controls/form/
│   │   ├── layout/
│   │   └── ui/{Popup,icons,DataGrid}/
│   ├── features/
│   │   ├── ai-assistant/{constants,hooks,pages,types}/
│   │   ├── dashboard/{components,data,pages,stores}/
│   │   ├── endorsements/{components,pages}/
│   │   ├── notifications/{components,services,stores}/
│   │   ├── policies/{pages,stores}/
│   │   ├── quotes/{cancellation,components,services,steps,utils}/
│   │   ├── renewals/{pages}/
│   │   └── settings/{components,data,pages}/
│   ├── hooks/
│   ├── lib/
│   ├── redux/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── utils/__tests__/
├── tests/{e2e,ct,mocks}/
├── skills/                 # signpost only; canonical skills are in .claude/skills
├── coverage/               # generated, gitignored
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

## Useful commands

```bash
npm install
npm run dev              # Vite dev server
npm run lint
npm run typecheck
npm run test             # Vitest unit/component
npm run test:coverage
npm run test:ct          # Playwright component tests
npm run test:e2e         # Playwright E2E (builds + previews first in CI)
npm run storybook
npm run build-storybook
npm run test:storybook   # axe over every story; requires a running Storybook
npm run build
npm run validate         # lint + typecheck + test + build, mirrors CI "quality" gate
```
