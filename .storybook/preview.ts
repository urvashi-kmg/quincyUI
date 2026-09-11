import type { Preview } from '@storybook/react';
import '../src/styles/index.css';

// Every story is checked against the a11y addon per .claude/rules/accessibility.md.
const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    backgrounds: {
      default: 'light',
      values: [{ name: 'light', value: '#ffffff' }],
    },
  },
};

export default preview;
