---
name: storybook-design-system
description: Make Storybook the visual and interaction contract for reusable Quincy-UI components, using Tailwind tokens and the a11y addon.
---

# Storybook & Design System Skill

## Purpose
Make Storybook the visual contract for reusable UI in `src/components/ui` and feature-level
components worth reusing.

## Rules
- Reuse existing `src/components/ui` components and Tailwind tokens (`tailwind.config.js`) before
  creating new ones.
- Add or update a `.stories.tsx` file alongside any new/changed reusable component.
- Cover meaningful states per story: default, variants, disabled, loading, empty, error, and long
  content.
- Keep stories deterministic: mock data/services at the story boundary (args, decorators), never
  call live services or real Axios from a story.
- Use `@storybook/test` interaction tests for important behavior (form submission, Popup
  open/close, grid row selection).
- The `@storybook/addon-a11y` check must be clean, or the violation documented as an accepted
  exception with a reason.
- Do not invent one-off colors, spacing, or typography values when a token in
  `tailwind.config.js` already covers it. If the design system genuinely lacks a needed
  token/component, stop and ask before adding one — see `.claude/rules/constants.md`.
