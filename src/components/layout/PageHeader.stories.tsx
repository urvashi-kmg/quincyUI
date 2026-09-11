import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';
import { Button } from '../ui/Button/Button';

const meta: Meta<typeof PageHeader> = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof PageHeader>;

export const TitleOnly: Story = { args: { title: 'Quotes' } };

export const WithDescription: Story = {
  args: { title: 'Quotes', description: 'Open quotes awaiting underwriting review.' },
};

export const WithActions: Story = {
  args: {
    title: 'Quotes',
    description: 'Open quotes awaiting underwriting review.',
    actions: <Button>New quote</Button>,
  },
};
