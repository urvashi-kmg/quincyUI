import { test, expect } from '@playwright/experimental-ct-react';

import { Button } from '@components/ui/Button';

test('Button renders and responds to a real browser click', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button onClick={() => (clicked = true)}>Bind policy</Button>,
  );

  await expect(component).toContainText('Bind policy');
  await component.click();
  expect(clicked).toBe(true);
});
