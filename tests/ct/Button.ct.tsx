import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from '@/components/ui/Button/Button';

/**
 * Playwright CT: real-browser interaction test, distinct from the Vitest
 * unit test on the same component — see .claude/rules/testing.md.
 */
test('calls onClick when the user presses the button', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button onClick={() => (clicked = true)}>Save changes</Button>,
  );

  await component.getByRole('button', { name: 'Save changes' }).click();
  expect(clicked).toBe(true);
});

test('is not clickable while loading', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button isLoading onClick={() => (clicked = true)}>
      Saving
    </Button>,
  );

  await expect(component.getByRole('button')).toBeDisabled();
  expect(clicked).toBe(false);
});
