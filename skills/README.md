# Skills

The canonical skill definitions live in [`../.claude/skills/`](../.claude/skills/) so that Claude
Code discovers them automatically:

| Skill | Covers |
|---|---|
| `frontend-architecture` | Layer boundaries, avoiding architecture drift |
| `storybook-design-system` | Storybook as the UI contract, Tailwind tokens |
| `testing` | Vitest / Playwright CT / Playwright E2E strategy |
| `api-service-server` | Axios boundary, typed contracts, error normalization |
| `css-styling` | Tailwind-first styling, CSS Modules, dark mode |
| `accessibility` | WCAG 2.1 AA, keyboard, axe, Storybook a11y |
| `security` | Secrets, XSS, PII, dependency risk |
| `performance` | Code splitting, render cost, bundle chunking |

This folder exists only as a signpost — do not duplicate skill content here, or the two copies
will drift apart.
