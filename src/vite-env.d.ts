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
