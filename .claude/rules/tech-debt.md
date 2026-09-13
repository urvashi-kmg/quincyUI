# Known Issues / Tech Debt

Carried forward from the as-built documentation so the assistant doesn't "fix" these unprompted —
touching any of them without being asked is an unrelated refactor and requires approval.

1. **Legacy endpoints**: some old endpoints (e.g., `changePolicy` GET) are kept for backward
   compatibility; new code should use the POST variants.
2. **Multiple mock data files**: `mockData.ts`, `mockDetailedData.ts`, and various `*.json` files
   under `src/data/` overlap; consolidation would help clarity but is out of scope unless asked.
3. **Placeholder feature pages**: routes like `/notepad`, `/task-manager`, `/doc-manager` are
   stubs pending backend implementation.
4. **Redux slices mixed with RTK Query**: some async state is still managed via slices (e.g.,
   `notepadUiSlice`) alongside RTK Query for the same feature; unification would reduce
   boilerplate but is a planned migration, not an ad hoc one.
5. **Hardcoded IIS path**: `/POC13/` is hardcoded in `vite.config.ts`; making it configurable is
   tracked but not yet done.
6. **Auth token refresh**: currently reactive (axios interceptor catches 401 and redirects to
   login) rather than proactive; a proactive refresh would be more robust.
