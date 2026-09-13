import type { Meta, StoryObj } from '@storybook/react';
import { TaskManagerChart } from './TaskManagerChart';

const meta: Meta<typeof TaskManagerChart> = {
  title: 'Dashboard/TaskManagerChart',
  component: TaskManagerChart,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof TaskManagerChart>;

export const Default: Story = {};
