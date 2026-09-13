import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Design System/Form Fields/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Formik
        initialValues={{ notes: '' }}
        validationSchema={Yup.object({ notes: Yup.string().required('Notes are required') })}
        onSubmit={() => {}}
      >
        <Form className="w-72">
          <Story />
        </Form>
      </Formik>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: { name: 'notes', label: 'Notes' } };

export const WithValue: Story = {
  decorators: [
    (Story) => (
      <Formik initialValues={{ notes: 'Follow up next week.' }} onSubmit={() => {}}>
        <Form className="w-72">
          <Story />
        </Form>
      </Formik>
    ),
  ],
  args: { name: 'notes', label: 'Notes' },
};

export const Disabled: Story = { args: { name: 'notes', label: 'Notes', disabled: true } };

export const Success: Story = {
  args: {
    name: 'notes',
    label: 'Notes',
    isSuccess: true,
    helpText: 'No green color token exists anywhere in the spec — no visual treatment yet.',
  },
};

export const WithError: Story = { args: { name: 'notes', label: 'Notes' } };
