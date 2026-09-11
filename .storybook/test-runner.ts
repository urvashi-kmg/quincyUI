import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

/**
 * Runs axe against every story. A new violation fails CI rather than being
 * advisory (.claude/rules/accessibility.md). A story may opt out only via
 * `parameters.a11y.disable` with a comment explaining why the rule does not
 * apply — that exception is reviewable in the diff.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    if (storyContext.parameters?.a11y?.disable) {
      return;
    }

    await configureAxe(page, {
      rules: storyContext.parameters?.a11y?.config?.rules ?? [],
    });

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  },
};

export default config;
