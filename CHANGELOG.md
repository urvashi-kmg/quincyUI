# Changelog

All notable changes to this project will be documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

## [0.1.0] - 2026-09-11

Baseline release — establishes Git tag `v0.1.0` as the first tracked version, matching the
existing `package.json` version. Entries below reflect the state of the codebase at this tag, not
a reconstructed commit-by-commit history (prior commits were not made under a versioning process).

### Added

- Initial application scaffold: React 18 + TypeScript (strict), Vite, React Router with
  route-level code splitting, Redux Toolkit store, Tailwind CSS token layer.
- Feature areas: dashboard, quotes, policies, endorsements, renewals, notifications, settings, and
  ai-assistant.
- Shared layers: `src/components/ui`, `src/components/layout`, `src/components/controls/form`,
  `src/services`, `src/redux`, `src/hooks`, `src/lib`, `src/utils`, `src/types`.
- Auth flow with in-memory token store (`src/auth/services/tokenStore.ts`).
- Testing setup: Vitest + React Testing Library, Playwright CT, Playwright E2E, Storybook with the
  a11y addon.
- CI pipeline (`.github/workflows/ci.yml`): lint, format check, typecheck, unit/coverage,
  component tests, E2E tests, production build, and Sentry release creation on `main`.
- Sentry integration for runtime error monitoring.
