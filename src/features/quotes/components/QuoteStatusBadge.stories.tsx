import type { Meta, StoryObj } from '@storybook/react';
import { QuoteStatusBadge } from './QuoteStatusBadge';

const meta: Meta<typeof QuoteStatusBadge> = {
  title: 'Quotes/QuoteStatusBadge',
  component: QuoteStatusBadge,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof QuoteStatusBadge>;

export const Draft: Story = { args: { status: 'draft' } };
export const Submitted: Story = { args: { status: 'submitted' } };
export const Approved: Story = { args: { status: 'approved' } };
export const Declined: Story = { args: { status: 'declined' } };

export const AllStatuses: Story = {
  render: () => (
    <div className="flex gap-2">
      <QuoteStatusBadge status="draft" />
      <QuoteStatusBadge status="submitted" />
      <QuoteStatusBadge status="approved" />
      <QuoteStatusBadge status="declined" />
    </div>
  ),
};
