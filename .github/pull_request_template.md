## What changed

<!-- Plain-language summary. One coherent change per PR. -->

## Linked issue / story

## AI assistance

- [ ] This PR was AI-assisted
- [ ] Prompt template used: `docs/prompts/____`

**If AI-assisted, paste the end-of-session report below** (required by `CLAUDE.md` — a PR without
it will be sent back):

<details>
<summary>End-of-session report</summary>

1. What changed:
2. Files created/modified:
3. Questions asked and answers received:
4. Assumptions made (should be none):
5. Tests added/updated:
6. Commands run + **actual output** (lint, typecheck, test, e2e/ct):
7. Accessibility status:
8. Security/PII considerations:
9. Left undone, and why:
10. Concerns raised, with severity:

</details>

## Definition of Done (`.claude/rules/code-review.md`)

- [ ] In scope — no unrelated files touched
- [ ] Reused existing components/services/slices/constants where they exist
- [ ] No inline `style={{}}`; no `axios`/`fetch` outside a services file
- [ ] No new shared constant / design token / dependency without approval (+ ADR if approved)
- [ ] Tests added at the appropriate layer(s), covering loading/empty/error/boundary states
- [ ] Storybook story added/updated for new or changed reusable UI
- [ ] Accessibility checked: keyboard, labels, contrast, axe clean (or documented exception)
- [ ] Security checked: no secrets/PII in code, logs, or Sentry payloads
- [ ] `npm run validate` passes locally
- [ ] Diff reviewed end-to-end for accidental changes

## Second reviewer required?

Changes touching auth, entitlements, customer data handling, payments, or the shared design
system need two reviewers.

- [ ] Not applicable
- [ ] Second reviewer requested: @
