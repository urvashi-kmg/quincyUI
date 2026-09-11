# Prompt Template — API / Data Integration

## 1. CONTEXT & USER STORY
Describe the user-facing feature and the data/API behavior required.

**Feature:**
> {{DESCRIBE_FEATURE}}

**Existing service to reuse, if any:**
> {{SERVICE_REFERENCE_OR_UNKNOWN}}

**Expected request/response contract:**
> {{CONTRACT_DETAILS_OR_UNKNOWN}}

**Acceptance criteria:**
- {{CRITERION_1}}
- {{CRITERION_2}}
- {{CRITERION_3}}

## 2. REPOSITORY RECONNAISSANCE
Before implementation, you MUST:
1. Read `CLAUDE.md`.
2. Read every relevant `.claude/rules/*.md` and `.claude/skills/*/SKILL.md`.
3. Inspect the nearest similar feature under `src/features/`, its Redux slice, and its services.
4. Locate existing shared components (`src/components/ui`), constants/types, Storybook stories,
   and tests relevant to this task.
5. Check `package.json` scripts and confirm the validation commands you'll run.
6. Identify existing Tailwind tokens and Storybook patterns this UI should follow.

Do not edit code until this inspection is complete.

## 3. IMPLEMENTATION PLAN
Before editing, provide a concise plan:
- files to create/change
- Redux state shape / service calls, if any
- Storybook changes
- test cases (unit / component / E2E)
- accessibility considerations
- security/PII considerations
- risks / assumptions
- approvals needed

If a requirement is ambiguous and could materially change architecture or behavior, ask before
coding — see `.claude/rules/clarification-protocol.md`.

## 4. IMPLEMENTATION GUARDRAILS
You MUST:
- reuse existing components/services/slices/constants before creating new ones
- keep all HTTP calls in `src/services/**` via the shared Axios instance
- style with Tailwind tokens or a CSS Module; no inline `style={{}}`
- follow Storybook/design-system guidance for every UI change
- use Redux Toolkit for any state beyond local component state
- use Formik + Yup for any form
- avoid unrelated refactoring and avoid unnecessary dependencies
- keep types explicit; no `any`
- preserve existing public contracts unless the task requires a change
- never expose secrets or PII
- keep accessibility and dark-mode behavior in scope

For a potentially reusable new shared constant/token/dependency, STOP and ask for approval first.

## 5. CODE + TESTS TOGETHER
Implement the smallest coherent change. At the same time, create/update:
- Vitest unit tests for new pure logic, reducers, and Yup schemas
- component tests (Vitest+RTL or Playwright CT) for user-visible behavior
- Storybook stories for meaningful UI states
- accessibility coverage (`jest-axe` and/or Storybook a11y addon)
- a regression test if this is a bug fix
- Playwright E2E only for a critical end-to-end journey

Do not postpone tests to a later step.

## 6. VALIDATION
Run and show real output for:
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run test` (and `npm run test:coverage` if coverage-relevant)
- Storybook a11y check for changed UI
- targeted `npm run test:ct` / `npm run test:e2e` if relevant

Never report a command as passed unless it actually ran.

## 7. FINAL SELF-REVIEW & REPORT
Review the final diff against `CLAUDE.md`, the relevant rule files, and skills.

Report:
1. What changed
2. Files created/modified
3. Tests added/updated
4. Commands run + results
5. Storybook/accessibility status
6. Security/PII considerations
7. Assumptions (should be none)
8. Remaining risks
9. Follow-up/approval required

If any guardrail was violated, say so explicitly and explain why.
