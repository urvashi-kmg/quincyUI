/**
 * Mechanical enforcement of Quincy-UI architecture rules.
 * See .claude/rules/*.md for the prose version of every rule below.
 */
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/strict',
    'plugin:boundaries/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', 'coverage', 'storybook-static', '*.config.*', '.eslintrc.cjs', '!.storybook'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.app.json', './tsconfig.node.json'],
  },
  plugins: ['react-refresh', 'boundaries'],
  settings: {
    react: { version: 'detect' },
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app/*' },
      { type: 'auth', pattern: 'src/auth/*' },
      { type: 'components', pattern: 'src/components/*' },
      { type: 'features', pattern: 'src/features/*', capture: ['feature'] },
      { type: 'services', pattern: 'src/services/*' },
      { type: 'redux', pattern: 'src/redux/*' },
      { type: 'hooks', pattern: 'src/hooks/*' },
      { type: 'lib', pattern: 'src/lib/*' },
      { type: 'utils', pattern: 'src/utils/*' },
      { type: 'types', pattern: 'src/types/*' },
    ],
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Rule: no inline styles — see .claude/rules/styling.md
    'react/forbid-dom-props': ['error', { forbid: ['style'] }],

    // Rule: no fetch/axios/XHR outside the services layer — see .claude/rules/api-services.md
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['axios'],
            message: 'Import axios only inside src/services/** or src/lib/axiosClient.ts.',
          },
        ],
      },
    ],
    'no-restricted-globals': [
      'error',
      { name: 'fetch', message: 'Use the services layer (src/services/**), not raw fetch().' },
    ],

    // Rule: layering boundaries — see .claude/rules/components.md and frontend-architecture skill
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          { from: 'app', allow: ['app', 'auth', 'components', 'features', 'redux', 'hooks', 'lib', 'utils', 'types'] },
          { from: 'auth', allow: ['auth', 'components', 'redux', 'hooks', 'lib', 'utils', 'types'] },
          { from: 'features', allow: ['auth', 'components', 'services', 'redux', 'hooks', 'lib', 'utils', 'types', 'features'] },
          { from: 'components', allow: ['components', 'hooks', 'lib', 'utils', 'types'] },
          { from: 'services', allow: ['auth', 'lib', 'utils', 'types'] },
          { from: 'redux', allow: ['auth', 'services', 'lib', 'utils', 'types'] },
          { from: 'hooks', allow: ['lib', 'utils', 'types'] },
        ],
      },
    ],
  },
  overrides: [
    {
      // The only files permitted to import axios directly.
      files: [
        'src/services/**/*.ts',
        'src/features/*/services/**/*.ts',
        'src/auth/services/**/*.ts',
        'src/lib/axiosClient.ts',
      ],
      rules: { 'no-restricted-imports': 'off' },
    },
    {
      // src/lib/config.ts is the one bootstrap-only exception to the
      // "no raw fetch" rule: it loads public/config.json to determine
      // apiBaseUrl itself, so it necessarily runs before axiosClient.ts's
      // apiClient can be constructed — see .claude/rules/api-services.md.
      files: ['src/lib/config.ts'],
      rules: { 'no-restricted-globals': 'off' },
    },
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', 'tests/**/*.{ts,tsx}', '**/*.stories.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'boundaries/element-types': 'off',
      },
    },
    {
      // Playwright E2E/CT specs under tests/** aren't included in either
      // tsconfig.app.json or tsconfig.node.json (neither covers this
      // directory), so type-aware parsing fails with a hard parsing error
      // rather than a rule violation. Fall back to syntax-only parsing here
      // instead of adding a new tsconfig project for a directory nothing
      // else type-checks.
      files: ['tests/**/*.{ts,tsx}'],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      parserOptions: { project: null },
    },
  ],
};
