# Rule: Code Review / Definition of Done Checklist

Before calling a change done, confirm every item:

- [ ] Meets the stated acceptance criteria.
- [ ] In scope for the requested task — no unrelated files touched without asking first.
- [ ] No new component/service/constant/dependency created without checking for an existing one;
      reuses existing components/services/slices/RTK Query endpoints/constants where they exist.
- [ ] No inline `style={{}}`; no raw Tailwind color/typography utilities on brand-visible UI; no
      raw `axios`/`fetch` outside `src/lib`/`src/services`; no direct
      `localStorage`/`sessionStorage` calls outside `src/auth`.
- [ ] No new shared constant/design token/dependency added without explicit approval.
- [ ] Redux state changes use existing slice patterns; no parallel state mechanism introduced.
- [ ] Tests written in the same change: unit and/or component and/or E2E as appropriate, covering
      happy path + loading/empty/error/boundary states.
- [ ] Accessibility checked: keyboard, labels, contrast, axe/jsx-a11y clean or documented
      exception.
- [ ] Security checked: no secrets/PII in code, logs, or Sentry payloads; no unsafe HTML; no
      hardcoded API URLs, tokens, or env-specific config.
- [ ] No unused imports or variables; no console errors or warnings.
- [ ] Permission checks in place (via `redux/selector.ts`) if the feature touches user actions.
- [ ] `npm run lint`, `npm run typecheck`, `npm run test` run with real, shown output — not
      asserted; `npm run test:ct` / `npm run test:e2e` run for affected flows.
- [ ] Storybook story added/updated for new/changed reusable UI, with the a11y addon clean.
- [ ] Diff reviewed end-to-end for accidental or unrelated changes.
- [ ] Commit message is clear and imperative, references the feature/bug.
- [ ] End-of-session report written per `CLAUDE.md`.

Reviewer note: PRs touching auth, entitlements, customer/policyholder data handling, payments, or
shared design-system components (`src/components/ui`, `src/redux`, `tailwind.config.js`) require a
second human reviewer in addition to the standard approval gate.
