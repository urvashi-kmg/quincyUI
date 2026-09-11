import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Forms/TextField',
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

export const WithError: Story = {
  args: { name: 'applicantName', label: 'Applicant name' },
  parameters: {
    // Storybook can't easily force Formik touched/error state via args alone;
    // see the component test for the validated-error-state assertion.
  },
};
