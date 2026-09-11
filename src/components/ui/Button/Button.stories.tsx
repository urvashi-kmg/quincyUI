import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, fn } from '@storybook/test';
import { Bell, Download, Trash2 } from 'lucide-react';
import { Button, type ButtonSize, type ButtonVariant } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  args: { children: 'Save changes', onClick: fn() },
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Button>;

const VARIANTS: ButtonVariant[] = [
  'purple',
  'pink',
  'gradient',
  'outlined-primary',
  'outlined-secondary',
  'danger',
];
const SIZES: ButtonSize[] = ['xl', 'large', 'm', 'small', 'x-small'];

export const Purple: Story = { args: { variant: 'purple' } };
export const Pink: Story = { args: { variant: 'pink' } };
export const Gradient: Story = { args: { variant: 'gradient' } };
export const OutlinedPrimary: Story = { args: { variant: 'outlined-primary' } };
export const OutlinedSecondary: Story = { args: { variant: 'outlined-secondary' } };
export const Danger: Story = { args: { variant: 'danger' } };

export const Loading: Story = { args: { isLoading: true, children: 'Saving…' } };
export const Disabled: Story = { args: { disabled: true } };

export const IconLeft: Story = {
  args: {
    children: (
      <>
        <Download size={16} aria-hidden="true" />
        Download
      </>
    ),
  },
};

export const IconRight: Story = {
  args: {
    children: (
      <>
        Continue
        <Download size={16} aria-hidden="true" />
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    children: <Trash2 size={16} aria-hidden="true" />,
    'aria-label': 'Delete',
  },
};

export const LongLabel: Story = {
  args: { children: 'This button has an unusually long label to test wrapping and truncation' },
};

/** Every variant × every size, for visual review — reads from the live component so it can't drift. */
export const VariantSizeMatrix: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex flex-col gap-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <p className="text-small font-semibold text-ink-primary">{variant}</p>
          <div className="flex flex-wrap items-center gap-3">
            {SIZES.map((size) => (
              <Button key={size} {...args} variant={variant} size={size}>
                Button
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Every variant's default / hover-simulated / active-simulated / disabled / loading appearance. */
export const StateMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <p className="text-small font-semibold text-ink-primary">{variant}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant={variant}>Default</Button>
            <Button variant={variant} disabled>
              Disabled
            </Button>
            <Button variant={variant} isLoading>
              Loading
            </Button>
            <Button variant={variant}>
              <Bell size={16} aria-hidden="true" />
              With icon
            </Button>
          </div>
          <p className="text-caption text-ink-secondary">
            Hover/active/focus are real :hover/:active/:focus-visible states — tab to or hover each
            button above to see them; they can&apos;t be captured as a static story render.
          </p>
        </div>
      ))}
    </div>
  ),
};

export const ClickInteraction: Story = {
  args: { variant: 'purple' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /save changes/i });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
