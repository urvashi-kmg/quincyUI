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
| Styling                   | Tailwind CSS, driven by a semantic CSS-variable token layer in `src/index.css` (see `.claude/rules/styling.md`)           |
| Icons                     | `lucide-react` only                                                                                                       |
| Tables                    | AG Grid Enterprise (`ag-grid-react`) for any enterprise/data-heavy table                                                  |
| Charts                    | Recharts                                                                                                                  |
| Server state              | RTK Query (`createApi` + `axiosBaseQuery`) — the default for remote data fetching                                         |
| Client/UI state           | Redux Toolkit slices (`src/redux/*.ts`, `src/stores/*.ts`, feature `stores/*Slice.ts`) — no parallel state library        |
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
| Deployment                | IIS, hardcoded to the `/POC13/` path (see `.claude/rules/deployment.md`)                                                  |

## Rule Zero — stop and ask, don't assume

1. If a task would touch a file outside the approved scope, **stop and ask first.** Writing the
   file and mentioning it afterward is a violation, not a shortcut.
2. If any requirement is unclear — error handling, permissions, which existing component/slice/
   service to reuse, a copy string, a status code — **ask before implementing.** Guessing,
   silently defaulting, and leaving `TODO` placeholders are all prohibited.
3. Raise every concern explicitly and classify it: `blocker`, `high`, `medium`, `low`. Blockers
   stop the work until resolved. Every item in `.claude/rules/known-deviations.md` and
   `.claude/rules/tech-debt.md` is a standing `medium` concern by default — raise it again at
   `high`/`blocker` if a task would touch it directly.
4. If a better approach exists than the one requested, say so with trade-offs, and let the
   developer decide. Do not silently substitute it.

## Mandatory per-task workflow

1. **Intake.** Restate the requested behavior, acceptance criteria, affected screens/routes, data
   needs, and definition of done.
2. **Repository reconnaissance.** Read this file, the rule files relevant to the task per the
   pointer table below, the relevant `.claude/skills/*/SKILL.md`, and inspect: the nearest similar
   feature under `src/features/`, existing Redux slices and RTK Query APIs, existing services/
   `lib` wrappers, existing shared constants/types, existing Storybook stories, and existing
   tests. Do not edit code until this is done.
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

## Rule files — read only what's relevant

This index and Rule Zero always apply to every task. Everything else lives in
`.claude/rules/*.md`, split by topic so a small task doesn't pay the token cost of the whole
contract. Read only the files relevant to what you're about to touch — e.g. a pure styling task
doesn't require reading `security.md` or `deployment.md`; a backend/API task doesn't require
reading `styling.md`. Skipping irrelevant rule files is expected, not a shortcut to flag.

| Topic                                       | File                                    |
| -------------------------------------------- | ---------------------------------------- |
| Architecture boundaries & repo layout        | `.claude/rules/architecture.md`          |
| Components & import boundaries               | `.claude/rules/components.md`            |
| Styling & design tokens                      | `.claude/rules/styling.md`               |
| Shared constants & design tokens             | `.claude/rules/constants.md`             |
| API/services & state management              | `.claude/rules/state-and-api.md`         |
| Axios/service file location rules            | `.claude/rules/api-services.md`          |
| Security & PII                               | `.claude/rules/security.md`              |
| Accessibility (WCAG 2.1 AA)                  | `.claude/rules/accessibility.md`         |
| Testing policy                               | `.claude/rules/testing.md`               |
| Performance                                  | `.claude/rules/performance.md`           |
| Coding style                                 | `.claude/rules/coding-style.md`          |
| Code review / definition-of-done checklist   | `.claude/rules/code-review.md`           |
| Clarification protocol (Rule Zero, in depth) | `.claude/rules/clarification-protocol.md`|
| Known deviations & migration debt            | `.claude/rules/known-deviations.md`      |
| Known issues / tech debt                     | `.claude/rules/tech-debt.md`             |
| Deployment (IIS)                             | `.claude/rules/deployment.md`            |
| Common task playbooks                        | `.claude/rules/playbooks.md`             |
| Coding standards, glossary & commands         | `.claude/rules/reference.md`             |

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

## Approval gates — ask the developer before

- Creating a new shared constant/design token/config contract.
- Adding a new npm dependency.
- Changing a public component prop, Redux slice shape, RTK Query endpoint contract, or
  `apiEndpoints.ts` entry.
- Changing routing, auth, or permission behavior — including anything touching the token-storage
  deviation in `.claude/rules/known-deviations.md`.
- Adding new global Redux state (in `src/redux` or `src/stores`) where local/feature state would do.
- Choosing RTK Query vs. a Redux Toolkit slice for new async state, where either could apply.
- Disabling or weakening a lint/type/test/security/accessibility rule.
- Touching anything listed in `.claude/rules/tech-debt.md` as part of a task that wasn't
  specifically asked to address it.
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
