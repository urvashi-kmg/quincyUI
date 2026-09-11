import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popup } from './Popup';
import { Button } from '../Button/Button';

const meta: Meta<typeof Popup> = {
  title: 'UI/Popup',
  component: Popup,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Popup>;

export const Interactive: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open popup</Button>
        <Popup isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm action">
          <p className="text-small text-ink-secondary">
            This is an example popup body. Press Escape or the close button to dismiss it.
          </p>
        </Popup>
      </>
    );
  },
};
