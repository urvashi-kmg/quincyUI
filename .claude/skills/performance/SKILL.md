---
name: performance
description: Keep Quincy-UI responsive — route-level code splitting, AG Grid/Recharts render cost, and bundle chunking — without premature optimization.
---

# Frontend Performance Skill

## Purpose
Keep Quincy-UI responsive without premature optimization.

## Rules
- Measure before optimizing when performance is not obviously affected by the change.
- Every feature route is code-split via `React.lazy` in `src/app/router.tsx`.
- Avoid unnecessary re-renders, redundant service calls, and large client bundles; use
  `useMemo`/`useCallback` for genuinely expensive derived data or stable callbacks passed into AG
  Grid/Recharts.
- Prefer AG Grid pagination/row models over loading unbounded datasets client-side for large
  collections (policies, quotes).
- Keep heavy vendor libraries (AG Grid, Recharts, Formik/Yup) isolated in the manual chunk config
  in `vite.config.ts` rather than pulled into the main app chunk.
- Do not trade correctness, accessibility, or maintainability for a speculative
  micro-optimization.
