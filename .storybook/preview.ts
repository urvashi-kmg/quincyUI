import type { Preview } from '@storybook/react';
import '../src/styles/index.css';

// Every story is checked against the a11y addon per .claude/rules/accessibility.md,
// and against both themes per .claude/rules/styling.md.
const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0f1420' },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
