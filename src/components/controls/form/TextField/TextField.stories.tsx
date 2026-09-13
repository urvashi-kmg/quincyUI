import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Design System/Form Fields/Input',
  component: TextField,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Formik
        initialValues={{ applicantName: '' }}
        validationSchema={Yup.object({
          applicantName: Yup.string().required('Applicant name is required'),
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

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: { name: 'applicantName', label: 'Applicant name', helpText: 'As it appears on the policy' },
};

export const WithValue: Story = {
  decorators: [
    (Story) => (
      <Formik initialValues={{ applicantName: 'Jordan Lee' }} onSubmit={() => {}}>
        <Form className="w-72">
          <Story />
        </Form>
      </Formik>
    ),
  ],
  args: { name: 'applicantName', label: 'Applicant name' },
};

export const Disabled: Story = {
  args: { name: 'applicantName', label: 'Applicant name', disabled: true },
};

export const Success: Story = {
  args: {
    name: 'applicantName',
    label: 'Applicant name',
    isSuccess: true,
    helpText:
      'No green color token exists anywhere in the spec — this state has no visual treatment yet, see the token migration report.',
  },
};

export const WithError: Story = {
  args: { name: 'applicantName', label: 'Applicant name' },
  parameters: {
    // Storybook can't easily force Formik touched/error state via args alone;
    // see the component test for the validated-error-state assertion.
  },
};
