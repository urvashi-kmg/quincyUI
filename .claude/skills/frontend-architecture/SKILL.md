---
name: frontend-architecture
description: Keep Quincy-UI changes aligned with its layered architecture (app/components/features/redux/services) and avoid architecture drift.
---

# Frontend Architecture Skill

## Purpose
Keep changes aligned with Quincy-UI's existing boundaries and avoid drift.

## Rules
- Inspect the nearest analogous feature under `src/features/` before creating a new pattern.
- Respect layering: `components/ui` is presentational-only; `features/*` owns connected
  components, pages, Redux slices, and feature services; `redux/` composes feature reducers;
  `services/` is the only Axios boundary. Boundaries are enforced by `eslint-plugin-boundaries`.
- Prefer composition over giant page components; extract a hook or subcomponent once a file mixes
  data-fetching, layout, and form logic together.
- Keep domain/business logic out of presentational components and out of CSS.
- Do not introduce new global Redux state when local component state or a feature-scoped slice
  would do.
- Do not create new folders merely to satisfy a preferred structure — follow the layout in
  `CLAUDE.md`.
- Preserve existing public contracts (component props, slice shape, service signature) unless the
  task explicitly requires a breaking change, and flag that explicitly.
- Keep changes small and reversible; one feature/story per session.

## Required output before implementation
State which layers are touched (e.g. "adds a `features/quotes/stores/quotesSlice.ts`, a
`features/quotes/services/quotesService.ts` call, and a `features/quotes/components/QuoteSummary`
component") and why each is necessary.
