# Rule: Coding Style

- TypeScript strict mode is non-negotiable (`tsconfig.app.json`). No `any`; model unknown shapes
  explicitly and narrow them.
- Functional components with hooks. No new class components.
- One component per file; file name matches the exported component name.
- Named exports for utilities/hooks; a component file may use a default export for the component
  itself alongside named exports for its types/variants.
- Props are explicit interfaces (`ComponentNameProps`), not inline object types, when there is
  more than one or two props.
- Prefer composition over prop-drilling deep option objects; extract a hook when a component's
  logic exceeds ~2 concerns.
- No commented-out code committed. Delete it; git history keeps it.
- No console.log left in committed code (console.warn/error for genuine runtime issues only, and
  never with PII — see security.md).
- Import order: external packages, then `@/` absolute imports, then relative imports. ESLint does
  not currently enforce this ordering mechanically — follow it by convention until it is added.
- Prettier is authoritative for formatting; do not hand-format against it.
