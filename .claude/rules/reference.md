# Coding Standards, Glossary & Commands

## Useful commands

```bash
npm install
npm run dev              # Vite dev server (http://localhost:5173)
npm run lint
npm run typecheck        # or: npm run build (includes tsc)
npm run test             # Vitest unit/component, single run
npm run test:watch
npm run test:coverage
npm run test:ct          # Playwright component tests
npm run test:e2e         # Playwright E2E
npm run test:e2e:ui      # Playwright E2E with UI
npm run storybook
npm run build-storybook
npm run test:storybook   # axe over every story; requires a running/built Storybook
npm run build
npm run validate         # lint + typecheck + test + build, mirrors CI "quality" gate
```

Linting is strict: `max-warnings 0` — any warning fails the build.

## Coding standards reference

- **TypeScript**: strict mode on; no unused vars/params (prefix `_` to suppress intentionally);
  `@/` alias resolves to `src/`.
- **React**: functional components only; hooks for state/effects; avoid `useEffect` chains where
  possible; `memo()`/`useMemo()`/`useCallback()` for stable props/expensive computation; a
  component, its hook, and its context provider may co-locate in one file
  (`react-refresh/only-export-components` is off for this reason); avoid re-exporting a component
  and its hook from the same index file.
- **Naming**: PascalCase for component files and React components; camelCase for utility files,
  variables, and functions; `UPPER_SNAKE_CASE` for constants; Tailwind classes lowercase-hyphenated.
- **Patterns to avoid**: direct DOM manipulation (refs only for browser APIs like focus); global
  variables (use Redux/context); import-time side effects; `.env` files for API URLs (use
  `public/config.json` at runtime instead).

## Glossary

- **LOB**: Line of Business (insurance category, e.g., Commercial Auto, Personal Auto)
- **Insured**: The person or entity being insured on a policy
- **Agency**: The insurance agency/broker (user of this app)
- **Quote**: A preliminary rate estimate for insurance coverage (not yet bound)
- **Endorsement**: A change to an existing policy (adds/removes coverage, updates info)
- **Cancellation**: The termination of an active policy
- **Underwriter**: Employee who reviews and approves quotes
- **Premium**: The cost of insurance coverage
- **RMV**: Registry of Motor Vehicles (used for driver validation)
- **VIN**: Vehicle Identification Number
- **RTK Query**: Redux Toolkit Query — async data fetching and caching library
- **SPA**: Single Page Application (routing happens client-side)
