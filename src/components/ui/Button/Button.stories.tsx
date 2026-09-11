import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, fn } from '@storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  args: { children: 'Save changes', onClick: fn() },
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Loading: Story = { args: { isLoading: true, children: 'Saving…' } };
export const Disabled: Story = { args: { disabled: true } };

export const ClickInteraction: Story = {
  args: { variant: 'primary' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /save changes/i });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
