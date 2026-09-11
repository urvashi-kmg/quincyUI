# Rule: Performance

- Route-level code splitting is required: every feature route in `src/app/router.tsx` is loaded
  via `React.lazy` + `Suspense`, not a static import.
- Measure before optimizing when a change is not obviously performance-affecting — don't
  speculatively memoize.
- Avoid unnecessary re-renders: memoize expensive derived data (`useMemo`) and stable callbacks
  passed to AG Grid/Recharts (`useCallback`) where profiling or clear cost justifies it.
- AG Grid: use server-side/pagination row models instead of loading unbounded row sets into the
  client for any feature with a large data volume (policies, quotes lists).
- Recharts: memoize formatted chart data derived from raw API responses; avoid recomputing on
  every render.
- Large, rarely-changing vendor libraries are isolated into manual chunks in `vite.config.ts`
  (`vendor-react`, `vendor-redux`, `vendor-grid`, `vendor-charts`, `vendor-forms`) — keep new heavy
  dependencies out of the main app chunk.
- Do not trade correctness, accessibility, or maintainability for a speculative micro-optimization.
