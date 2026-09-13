import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Design System/Form Fields/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Formik initialValues={{ plan: 'monthly' }} onSubmit={() => {}}>
        <Form className="flex w-72 flex-col gap-2">
          <Story />
        </Form>
      </Formik>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Radio>;

export const Group: Story = {
  render: () => (
    <>
      <Radio name="plan" value="monthly" label="Monthly" />
      <Radio name="plan" value="annual" label="Annual" />
    </>
  ),
};

export const Disabled: Story = {
  render: () => <Radio name="plan" value="monthly" label="Monthly" disabled />,
};
