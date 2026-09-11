/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      exclude: ['node_modules', 'dist', 'tests/e2e/**', 'tests/ct/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: './coverage',
        exclude: [
          'node_modules/**',
          'src/test/**',
          '**/*.stories.tsx',
          '**/*.d.ts',
          'tests/**',
          '.storybook/**',
        ],
        thresholds: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80,
        },
      },
    },
  }),
);
