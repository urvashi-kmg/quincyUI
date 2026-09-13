import type { Meta, StoryObj } from '@storybook/react';
import { CancelReasonChart } from './CancelReasonChart';

const meta: Meta<typeof CancelReasonChart> = {
  title: 'Dashboard/CancelReasonChart',
  component: CancelReasonChart,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof CancelReasonChart>;

export const Default: Story = {};
