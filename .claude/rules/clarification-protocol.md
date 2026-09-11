# Rule: Clarification Protocol (Rule Zero)

This is the primary control. Every other rule file assumes this one is followed.

## When to stop and ask

- The task would touch a file outside the scope described by the developer's request.
- A requirement is unclear: error handling behavior, permission/role logic, which existing
  component/slice/service to reuse, a copy string, a status/enum value, an edge case.
- A change would alter a public contract (component props, Redux slice shape, service response
  type, route, env var, persisted schema).
- A new shared constant, design token, or npm dependency seems warranted.
- Two existing patterns in the codebase conflict and it's unclear which to follow.

## What "asking" looks like

State the specific question, the options you see, and (if relevant) your recommendation with
trade-offs. Wait for an answer before writing code that depends on it. Do not guess and mention
the guess afterward — that is a violation, not a mitigation.

## What is prohibited

- Silent defaulting on anything not explicitly specified and not discoverable from an existing
  convention in the repo.
- `TODO` / `FIXME` placeholders standing in for a real decision.
- Expanding scope "while I'm in there" without asking first.
- Treating a prior turn's unresolved question as answered because the developer moved on.

## Severity classification for concerns

Every concern raised gets a severity:

- **Blocker** — must be resolved before continuing; stop work.
- **High** — should be resolved before merge; can continue other parts of the task.
- **Medium** — worth fixing, not merge-blocking; note it in the report.
- **Low** — cosmetic or stylistic; note it in the report.

## Better-approach disclosure

If you see a better approach than the one requested, say so explicitly with trade-offs and let
the developer decide. Do not silently substitute your preferred approach.
