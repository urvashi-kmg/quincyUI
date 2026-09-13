import type { Meta, StoryObj } from '@storybook/react';
import { WrittenPremiumByLobChart } from './WrittenPremiumByLobChart';

const meta: Meta<typeof WrittenPremiumByLobChart> = {
  title: 'Dashboard/WrittenPremiumByLobChart',
  component: WrittenPremiumByLobChart,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-3xl"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof WrittenPremiumByLobChart>;

export const Default: Story = {};
