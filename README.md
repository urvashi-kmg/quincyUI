# Quincy UI

Enterprise frontend for the Quincy customer portal — React + TypeScript, AI-assisted development
with mechanical guardrails baked in.

**Start here:** [`CLAUDE.md`](./CLAUDE.md) is the top-level contract every AI assistant (and every
developer) reads before touching this repo. It links out to `.claude/rules/*.md` (eleven
enforceable rules) and `.claude/skills/*/SKILL.md` (eight capability skills).

## Stack

React 18 + TypeScript (strict) · Vite · React Router · Tailwind CSS + CSS Modules · Lucide icons ·
AG Grid · Recharts · Redux Toolkit (server/client/complex state) · Formik + Yup · Axios ·
Vitest + Playwright CT + Playwright E2E · ESLint + Prettier + Husky/lint-staged · npm ·
GitHub Actions · Sentry + Monocart test reporting.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in VITE_API_BASE_URL at minimum
npm run dev                  # http://localhost:5173
```

```bash
npm run validate             # lint + typecheck + test + build — mirrors CI's "quality" gate
npm run storybook            # http://localhost:6006
npm run test:ct              # Playwright component tests
npm run test:e2e             # Playwright E2E (builds + previews the app first)
```

> This scaffold was generated without network/registry access, so dependency versions in
> `package.json` are pinned to specific known-good releases but have **not** been installed or
> resolved against the live npm registry. Run `npm install` and address any resolution errors
> before treating this as a working tree — check current versions if any fail to resolve.

## What's wired up vs. stubbed

**Fully wired, as working reference patterns:**
- `src/features/dashboard` — Axios service → Redux Toolkit async thunk → slice → connected page
  with loading/error/empty states, plus a Recharts trend chart that exposes its data as an
  `sr-only` table so the chart isn't the only conveyance. Tested at the slice, component, and E2E
  layers.
- `src/features/quotes` — same data pattern, plus an AG Grid list page using the shared `DataGrid`
  wrapper, a custom cell renderer (`QuoteStatusBadge`), and domain predicates in
  `utils/quoteStatus.ts` with full branch coverage.
- `src/features/notifications` — slice with memoized selectors (`selectUnreadCount`) and a
  `NotificationBell` that puts the unread count in its accessible name, not just a colour badge.
- `src/auth` — in-memory token store (deliberately *not* browser storage, per the security rule),
  auth slice that keeps the token out of Redux entirely, permission helpers, and a
  `RequirePermission` component documented as UX-only.
- `src/components/ui` — `Button`, `Popup`, `DataGrid`; `src/components/layout/PageHeader`;
  `src/components/controls/form/TextField` (Formik + Yup with accessible error association). Each
  has a Storybook story and a Vitest + `jest-axe` test.
- `src/features/ai-assistant` — composer with a length budget and a standing PII warning. Sending
  is deliberately unwired; see the note in the page.
- Tests at all three layers: Vitest (+ MSW, with `onUnhandledRequest: 'error'`), Playwright CT,
  and Playwright E2E with route mocks.

**Scaffolded but intentionally not implemented** — `policies`, `endorsements`, `renewals`, the
quote wizard `steps/`, and quote `cancellation/`. Each has a README naming the specific decisions
that need answering first (API contracts, step sequences, reason codes, who may cancel). Per Rule
Zero these were not guessed. Use `docs/prompts/01-feature-implementation.md` to implement them
against real acceptance criteria.

## Guardrails that actually block a build

Not advisory — these fail `npm run validate` or CI:

| Rule | Mechanism |
|---|---|
| No inline `style={{}}` | `react/forbid-dom-props` (one documented exception, in `DataGrid`) |
| Axios/`fetch` only in service files | `no-restricted-imports` + `no-restricted-globals`, with a path-scoped override |
| Layer import boundaries | `eslint-plugin-boundaries` (`components` cannot import `features`; `services`/`redux` cannot import UI) |
| No `any`, strict null/index access | `tsconfig.app.json` + `@typescript-eslint/recommended-type-checked` |
| Accessibility | `jsx-a11y` (strict) at lint time, `jest-axe` in tests, axe over every story via `@storybook/test-runner` |
| Coverage floor | `vitest.config.ts` thresholds (80/75) |
| Committed secrets | gitleaks in CI |
| Vulnerable dependencies | `npm audit --audit-level=high` in CI |
| Dead code / unused deps | `knip` in CI |
| Oversized PRs | diff-size job warns above ~400 lines / ~10 source files |
| Two-reviewer paths | `.github/CODEOWNERS` on auth, services, `components/ui`, `tailwind.config.js`, and `.claude/` itself |

## Directory guide

See the "Repository layout" section of [`CLAUDE.md`](./CLAUDE.md) for the full annotated tree.
Quick orientation:

- `.claude/rules/` — eleven enforceable rule files (clarification protocol, coding style, styling,
  components, API/services, constants, testing, accessibility, security, performance, code review).
- `.claude/skills/` — eight `SKILL.md` capability guides (architecture, Storybook/design-system,
  testing, API/services, CSS/styling, accessibility, security, performance).
- `docs/prompts/` — seven copy-ready prompt templates for the common task types.
- `docs/adr/` — architecture decision records; add one whenever an approval-gated decision in
  `CLAUDE.md` is exercised.
- `src/app/` — providers + router composition root only.
- `src/components/ui` — feature-agnostic, reusable, Storybook-documented components.
- `src/features/<name>/` — one folder per business capability; see `CLAUDE.md` for the allowed
  subfolders and import boundaries.
- `src/redux/store.ts` — where every feature's slice gets registered.
- `src/services/` — reserved for cross-feature/shared services; feature-specific services live in
  `src/features/<name>/services`.
- `tests/e2e`, `tests/ct`, `tests/mocks` — Playwright E2E specs, Playwright CT specs, and shared
  MSW handlers.

## CI

`.github/workflows/ci.yml` runs, on every PR: lint → typecheck → format check → unit tests with
coverage → build → Storybook build → Playwright E2E → Playwright CT. All are required checks; none
are advisory.

## Using AI assistance on this repo

1. Read `CLAUDE.md` once per session (the assistant does this automatically at task start).
2. Pick the matching template from `docs/prompts/` and fill in only the `{{PLACEHOLDER}}` fields.
3. Expect the assistant to ask clarifying questions before writing code — that's Rule Zero working
   as intended, not friction to route around.
4. Require the end-of-session report (see `CLAUDE.md`) in every PR description.
5. PRs touching auth, entitlements, customer data handling, or `src/components/ui` /
   `tailwind.config.js` need a second human reviewer.
