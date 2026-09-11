# Rule: Styling (Tailwind + CSS Modules)

- Tailwind utility classes are the default styling mechanism.
- Use a CSS Module (`Component.module.css`) only when Tailwind utilities become unreadable for a
  genuinely complex layout (nested grid areas, third-party widget override scoping such as AG
  Grid theme overrides). Justify the choice in the PR description.
- **No inline `style={{}}`.** This is mechanically enforced by `react/forbid-dom-props` in
  `.eslintrc.cjs`. There is no exception; if a value must be dynamic, use a CSS custom property
  set via a `className` + `:root`/data-attribute pattern, or a Tailwind arbitrary-value class.
- Use the token layer in `tailwind.config.js` (`colors.brand`, `colors.surface`, `colors.muted`,
  `colors.border`, `fontFamily`) instead of raw hex values or default Tailwind palette classes for
  anything brand-visible. Ask before adding a new token — see constants.md.
- Dark mode uses Tailwind's `class` strategy. Any new component must be visually checked in both
  `light` and `dark` (toggle via `useTheme`, see `src/hooks/useTheme.ts`) before it's done.
- Respect `prefers-reduced-motion` for non-essential animation (`motion-safe:`/`motion-reduce:`
  variants).
- Visible focus styles are required on every interactive element — do not remove Tailwind's
  default focus ring without providing an equivalent.
