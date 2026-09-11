import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Design System/Form Fields/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Formik initialValues={{ agree: false }} onSubmit={() => {}}>
        <Form className="w-72">
          <Story />
        </Form>
      </Formik>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = { args: { name: 'agree', label: 'I agree to the terms' } };

export const Checked: Story = {
  decorators: [
    (Story) => (
      <Formik initialValues={{ agree: true }} onSubmit={() => {}}>
        <Form className="w-72">
          <Story />
        </Form>
      </Formik>
    ),
  ],
  args: { name: 'agree', label: 'I agree to the terms' },
};

export const Disabled: Story = {
  args: { name: 'agree', label: 'I agree to the terms', disabled: true },
};
