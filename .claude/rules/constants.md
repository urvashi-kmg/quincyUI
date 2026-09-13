# Rule: Shared Constants & Design Tokens

- Search `src/types`, `src/lib/apiEndpoints.ts`, the target feature's existing `constants/` (e.g.
  `features/ai-assistant/constants`), `tailwind.config.js`, and `src/index.css` before creating any
  new constant/token. (`tailwind.config.js` vs. `src/index.css` is an open discrepancy over which
  is the true token source — see `known-deviations.md` ("Design token location") and `styling.md`.)
- If the exact value already exists, reuse it — do not create a near-duplicate.
- A value used by exactly one component/feature stays local to that file/feature. Do not
  pre-emptively promote it to a shared location "in case it's reused later."
- A value that is genuinely likely to be reused app-wide (a route path, a status enum, a
  pagination default, a design token) is proposed as a shared constant and requires explicit
  developer approval before being added to a shared location.
- Do not duplicate route paths, labels, status strings, feature flags, timeouts, pagination
  defaults, or Tailwind design tokens that already exist.
- Add new design-system patterns to `src/index.css` under `@layer components` _before_ using them
  elsewhere, and update `DESIGN_TOKENS.md` immediately in the same change.
- Avoid magic numbers/strings where the value represents a domain contract (a policy status code,
  a grid page size) — name it.
