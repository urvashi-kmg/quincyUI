# Known Deviations & Migration Debt

These are places where the aspirational governance contract and the as-built codebase disagreed.
Do not silently pick one — confirm with a developer before writing auth, token, or design-token
code, and flag it again as a `blocker` if a task touches these areas directly.

- **Token storage.** One source of truth says the access token must live only in an in-memory
  `auth/services/tokenStore.ts` and never in Redux or browser storage; the as-built app currently
  stores the access token in Redux, with the refresh token in `sessionStorage` via
  `auth/utils/tokenStorage.ts`. **Confirm which model is authoritative before changing anything in
  `src/auth` or `src/redux/authSlice.ts`.**
- **Design token location.** One source of truth says tokens live in `tailwind.config.js`; the
  as-built system defines them as CSS variables in `src/index.css` consumed through
  `@layer components` classes. This document treats `src/index.css` as current source of truth
  (see [Styling policy](styling.md)) since it matches the actual codebase, but confirm before
  adding new tokens in either location.
- **Dark mode intent.** One source of truth implies no dark-mode planning; the as-built token
  system is explicitly structured to support it via a variable swap. Don't add dark values without
  approval either way.
- **AppShell location.** One source of truth places the connected shell in `src/app`; the as-built
  repo places it in `src/layouts/shared/AppShell.tsx`. Treat `src/layouts/shared` as current.
- **State-fetching pattern.** One source of truth describes Redux Toolkit as the sole state
  mechanism; the as-built app uses RTK Query for async/remote data (quotes, tasks, notepad)
  alongside Redux Toolkit slices for UI state — and some legacy code mixes both for the same
  feature (see [tech debt](tech-debt.md) below). Prefer RTK Query for new remote-data work; ask
  before adding a new RTK Query API vs. a thunk-based slice.
- **AG Grid edition.** As-built uses AG Grid **Enterprise** specifically — check licensing/feature
  usage before adding new grid features that assume the Community edition.
