---
name: css-styling
description: Keep Quincy-UI styling predictable via Tailwind tokens and CSS Modules, consistent with the design system and dark mode.
---

# CSS & Styling Skill

## Purpose
Keep styling predictable, maintainable, and consistent with the Tailwind token system.

## Rules
- No inline CSS (`style={{}}`) — mechanically blocked by ESLint.
- Tailwind utility classes by default; a CSS Module only for genuinely complex layout or
  third-party (AG Grid theme) override scoping.
- Reuse `tailwind.config.js` tokens (`brand`, `surface`, `muted`, `border`, `fontFamily`) before
  introducing a literal value.
- Avoid `!important` unless documented as required for a third-party override.
- Do not duplicate the same utility combination across many files when a shared component or a
  new token (with approval) would be more appropriate.
- Support both light and dark theme (`darkMode: 'class'`) for every new visual component.
- Preserve visible focus states; respect `prefers-reduced-motion` for non-essential animation.
- Do not use CSS to hide semantically important content from assistive technology (e.g.
  `display: none` on content that should be reachable, vs. intentionally decorative elements).
- Before creating a new design token, ask whether it belongs in the shared `tailwind.config.js`
  theme — see `.claude/rules/constants.md`.
