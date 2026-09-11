# Rule: Code Review / Definition of Done Checklist

Before calling a change done, confirm every item:

- [ ] In scope for the requested task — no unrelated files touched without asking first.
- [ ] No new component/service/constant/dependency created without checking for an existing one.
- [ ] No inline `style={{}}`; no raw `axios`/`fetch` outside `src/services`.
- [ ] No new shared constant/design token/dependency added without explicit approval.
- [ ] Redux state changes use existing slice patterns; no parallel state mechanism introduced.
- [ ] Tests written in the same change: unit and/or component and/or E2E as appropriate, covering
      happy path + loading/empty/error/boundary states.
- [ ] Accessibility checked: keyboard, labels, contrast, axe/jsx-a11y clean or documented
      exception.
- [ ] Security checked: no secrets/PII in code, logs, or Sentry payloads; no unsafe HTML.
- [ ] `npm run lint`, `npm run typecheck`, `npm run test` run with real, shown output — not
      asserted.
- [ ] Storybook story added/updated for new/changed reusable UI.
- [ ] Diff reviewed end-to-end for accidental or unrelated changes.
- [ ] End-of-session report written per `CLAUDE.md`.

Reviewer note: PRs touching auth, entitlements, customer/policyholder data handling, payments, or
shared design-system components (`src/components/ui`, `src/redux`, `tailwind.config.js`) require a
second human reviewer in addition to the standard approval gate.
