# Rule: API / Services & State Management

## API / services policy

- All endpoint paths live in `src/lib/apiEndpoints.ts`, typed against `src/types` where the
  contract is shared.
- Components/hooks call an RTK Query endpoint (`createApi` + `axiosBaseQuery`) or a
  `src/services/**` function — never `axios`/`fetch` directly.
- Centralize auth headers, error normalization, and token injection in `src/lib/axiosClient.ts`.
  401 responses are currently caught by the axios interceptor and redirect to login (see
  [tech debt](tech-debt.md) re: proactive refresh).
- Handle loading / success / empty / partial / error states explicitly in the UI (AG Grid and
  Recharts consumers included). Use `src/utils/errorMessages.ts` for consistent user-facing text.
- Never log request bodies, auth headers, or PII (names, emails, policy numbers, VINs, license
  numbers, etc.). Scrub PII from any Sentry breadcrumb/context.

See also `.claude/rules/api-services.md` for which files are permitted to import `axios` and the
service-file location conventions, and [Known Deviations](known-deviations.md) for the RTK Query
vs. Redux Toolkit slice split for async/remote state.
