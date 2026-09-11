# Rule: Shared Constants & Design Tokens

- Search `src/types`, the target feature's existing `constants/` (e.g.
  `features/ai-assistant/constants`), and `tailwind.config.js` before creating any new
  constant/token.
- If the exact value already exists, reuse it — do not create a near-duplicate.
- A value used by exactly one component/feature stays local to that file/feature. Do not
  pre-emptively promote it to a shared location "in case it's reused later."
- A value that is genuinely likely to be reused app-wide (a route path, a status enum, a
  pagination default, a design token) is proposed as a shared constant and requires explicit
  developer approval before being added to a shared location.
- Do not duplicate route paths, labels, status strings, feature flags, timeouts, pagination
  defaults, or Tailwind design tokens that already exist.
- Avoid magic numbers/strings where the value represents a domain contract (a policy status code,
  a grid page size) — name it.
