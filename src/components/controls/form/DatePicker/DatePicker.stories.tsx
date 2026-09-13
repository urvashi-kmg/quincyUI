import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Design System/Form Fields/Date',
  component: DatePicker,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Formik
        initialValues={{ effectiveDate: '' }}
        validationSchema={Yup.object({
          effectiveDate: Yup.string().required('Effective date is required'),
        })}
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

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = { args: { name: 'effectiveDate', label: 'Effective date' } };

export const WithValue: Story = {
  decorators: [
    (Story) => (
      <Formik initialValues={{ effectiveDate: '2026-01-15' }} onSubmit={() => {}}>
        <Form className="w-72">
          <Story />
        </Form>
      </Formik>
    ),
  ],
  args: { name: 'effectiveDate', label: 'Effective date' },
};

export const Disabled: Story = {
  args: { name: 'effectiveDate', label: 'Effective date', disabled: true },
};

export const Success: Story = {
  args: {
    name: 'effectiveDate',
    label: 'Effective date',
    isSuccess: true,
    helpText: 'No green color token exists anywhere in the spec — no visual treatment yet.',
  },
};

export const WithError: Story = { args: { name: 'effectiveDate', label: 'Effective date' } };
