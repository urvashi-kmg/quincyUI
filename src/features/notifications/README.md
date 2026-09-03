# notifications

Scaffolded feature module. Structure mirrors `features/quotes`:

- `components/` — presentational + container components local to this feature
- `pages/` — route-level components, lazy-loaded from `app/routes.tsx`
- `hooks/` — feature-specific hooks (wrap this feature's slice selectors/dispatches, see `features/quotes/hooks/useQuoteWizard.ts`)
- `services/` — API layer (RTK Query api slice, calling through `@services/gatewayClient`)
- `stores/` — Redux Toolkit slice(s). Even purely local UI state (e.g. a wizard step) gets its own slice and reducer key — see `features/quotes/stores/quoteWizardSlice.ts` — rather than a second state library.
- `types/` — feature-scoped types (promote to `src/types` only if used by 2+ features)

Import this feature elsewhere only via its `index.ts` barrel export.
