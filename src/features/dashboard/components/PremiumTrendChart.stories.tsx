import type { Meta, StoryObj } from '@storybook/react';
import { PremiumTrendChart } from './PremiumTrendChart';
import { samplePremiumTrend } from '../data/premiumTrend';

const meta: Meta<typeof PremiumTrendChart> = {
  title: 'Dashboard/PremiumTrendChart',
  component: PremiumTrendChart,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-3xl"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof PremiumTrendChart>;

export const Default: Story = { args: { data: samplePremiumTrend } };

export const SinglePoint: Story = { args: { data: samplePremiumTrend.slice(0, 1) } };

export const Empty: Story = { args: { data: [] } };
