---
name: accessibility
description: Keep Quincy-UI operable and understandable for keyboard and assistive-technology users, per WCAG 2.1 AA.
---

# Accessibility Skill

## Purpose
Make Quincy-UI operable and understandable for keyboard and assistive-technology users.

## Rules
- Prefer semantic HTML over ARIA where a native element does the job.
- Every interactive control (including custom `src/components/ui` components, AG Grid custom cell
  editors, and Formik-bound form controls) has an accessible name.
- Preserve keyboard navigation and visible focus for every interactive element.
- Never use color as the only signal — status chips, chart series (Recharts), and form validation
  need a text or icon companion.
- Check contrast (4.5:1 for normal text) against the token backgrounds.
- Form fields use a real `<label>` associated via Formik + `htmlFor`/`id`; validation errors are
  linked via `aria-describedby` and announced.
- Test meaningful states with the Storybook a11y addon and, for interactive components,
  `jest-axe` in the component test.
- Do not suppress a `jsx-a11y`/axe violation without documenting why the rule does not apply.
