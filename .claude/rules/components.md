# Rule: Components & Architecture Boundaries

- Search `src/components/ui`, `src/components/layout`, `src/components/controls/form`, and the
  target feature's own `components/` folder before creating a new component. Reuse or extend
  before creating.
- `src/components/ui` components are presentational and feature-agnostic — no feature-specific
  copy, no direct Redux `useSelector` on feature slices, no service calls. They take data via
  props.
- Feature components (`src/features/<name>/components`) may connect to Redux and call services
  (through the services layer, not directly).
- Enforced import boundaries (`eslint-plugin-boundaries` in `.eslintrc.cjs`):
  - `components/*` may import `components`, `hooks`, `lib`, `utils`, `types` — never `features`,
    `services`, or `redux` directly.
  - `features/*` may import `components`, `services`, `redux`, `hooks`, `lib`, `utils`, `types`,
    and other `features` **only through their public exports** (e.g. shared UI, not another
    feature's internal state) — prefer promoting genuinely cross-feature code into `components`,
    `services`, `redux`, or `types` instead of reaching into a sibling feature.
  - `services/*` and `redux/*` may not import `components` or `features` (keeps state/data layers
    UI-agnostic).
- Do not create a giant page component. Extract a component or hook once a single file mixes more
  than one concern (data fetching + layout + form logic, for example).
- AG Grid usage: wrap grid configuration (column defs, default col def, cell renderers) in
  `src/components/ui/DataGrid` or a feature-local `*Grid.tsx`; do not scatter raw `AgGridReact`
  props across page components.
- Recharts usage: keep chart config (axes, tooltips, formatters) colocated with the chart
  component, not duplicated per page.
- Do not create `misc`, `helpers2`, `new`, or other catch-all folders/files to avoid deciding
  ownership.
