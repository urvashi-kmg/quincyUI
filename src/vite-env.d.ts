/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_APP_ENV?: 'development' | 'preview' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// tailwind.config.js has no type declarations of its own (allowJs is off
// project-wide, and turning it on is a broader compiler-behavior change than
// this design-system change warrants) — typed narrowly here so the
// "Design System/Colors" Storybook page can import it directly and read the
// live theme rather than a hand-copied duplicate.
declare module '*/tailwind.config.js' {
  const config: import('tailwindcss').Config;
  export default config;
}

// jest-axe ships no type declarations and @types/jest-axe is a new dependency
// (approval-gated — see .claude/rules/security.md), so it's typed narrowly
// here instead. Shapes only what this repo actually uses. (The matching
// `expect(...).toHaveNoViolations()` matcher augmentation lives in
// src/test/jest-axe.d.ts, not here — augmenting vitest's own `Assertion`
// type requires a real ES module file (one with a top-level import/export),
// and this file has none, so it stays a global ambient script.)
declare module 'jest-axe' {
  interface AxeResults {
    violations: unknown[];
    toolOptions?: { impactLevels?: string[] };
  }
  export function axe(html: Element | string, options?: Record<string, unknown>): Promise<AxeResults>;
  export function configureAxe(options?: Record<string, unknown>): typeof axe;
  export const toHaveNoViolations: { toHaveNoViolations(results: AxeResults): { pass: boolean; message(): string } };
}
