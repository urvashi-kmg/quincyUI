# Rule: Styling (Tailwind + CSS Modules)

- Tailwind utility classes are the default styling mechanism.
- Use a CSS Module (`Component.module.css`) only when Tailwind utilities become unreadable for a
  genuinely complex layout (nested grid areas, third-party widget override scoping such as AG
  Grid theme overrides). Justify the choice in the PR description.
- **No inline `style={{}}`.** This is mechanically enforced by `react/forbid-dom-props` in
  `.eslintrc.cjs`. There is no exception; if a value must be dynamic, use a CSS custom property
  set via a `className` + `:root`/data-attribute pattern, or a Tailwind arbitrary-value class. No
  CSS-in-JS (styled-components, emotion) either.
- Use the token layer in `tailwind.config.js` (`colors.brand`, `colors.surface`, `colors.muted`,
  `colors.border`, `fontFamily`) instead of raw hex values or default Tailwind palette classes for
  anything brand-visible. Ask before adding a new token — see `constants.md`.
  **Open discrepancy:** the app's actual semantic-class layer (`.text-body`, `.bg-surface`,
  `.border-default`, `.text-heading-xl`/`-lg`, `.text-caption`, plus `@layer components` patterns
  like `.btn-primary/secondary/danger`, `.input*`, `.card*`, `.table*`, `.badge*`) is driven by
  CSS variables in `src/index.css`, not by `tailwind.config.js` directly. This is not resolved by
  this file — see `known-deviations.md` ("Design token location") and confirm with a developer
  before adding new tokens in either location.
- Raw Tailwind color/typography utilities (e.g. `text-slate-900`, `bg-white`, `text-xs`,
  `text-lg font-semibold`) are not allowed on brand-visible UI — use the semantic classes above.
  Safe raw utilities that need no token: layout (`flex`, `grid`, `justify-*`, `items-*`, `gap-*`),
  spacing (`mt-4`, `px-6`, `space-y-2`), sizing (`w-full`, `max-w-md`, `h-12`), responsive
  (`md:flex`, `lg:grid`, `hidden sm:block`), display (`hidden`, `block`, `inline-block`).
- The application supports a single fixed light theme — there is no dark mode or theme switching.
  The variable structure is explicitly structured to support a dark-mode swap with no component
  changes, but do not add dark-mode values until explicitly approved.
- Respect `prefers-reduced-motion` for non-essential animation (`motion-safe:`/`motion-reduce:`
  variants).
- Visible focus styles are required on every interactive element — do not remove Tailwind's
  default focus ring without providing an equivalent.
- Responsive behavior: Tailwind breakpoints plus the `useBreakpoint()` hook for layout logic.
