import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Select } from './Select';

const OPTIONS = [
  { value: 'underwriters', label: 'CL Underwriters' },
  { value: 'assistant-underwriters', label: 'CL Assistant Underwriters' },
  { value: 'operations', label: 'CL Operations' },
  { value: 'management', label: 'CL Management' },
];

const meta: Meta<typeof Select> = {
  title: 'Design System/Form Fields/Select',
  component: Select,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Formik
        initialValues={{ team: '' }}
        validationSchema={Yup.object({ team: Yup.string().required('Team is required') })}
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

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: { name: 'team', label: 'Team', options: OPTIONS, placeholder: 'Placeholder Text' },
};

export const WithValue: Story = {
  decorators: [
    (Story) => (
      <Formik initialValues={{ team: 'operations' }} onSubmit={() => {}}>
        <Form className="w-72">
          <Story />
        </Form>
      </Formik>
    ),
  ],
  args: { name: 'team', label: 'Team', options: OPTIONS },
};

export const Disabled: Story = {
  args: { name: 'team', label: 'Team', options: OPTIONS, disabled: true },
};

export const Success: Story = {
  args: {
    name: 'team',
    label: 'Team',
    options: OPTIONS,
    isSuccess: true,
    helpText: 'No green color token exists anywhere in the spec — no visual treatment yet.',
  },
};

export const WithError: Story = {
  args: { name: 'team', label: 'Team', options: OPTIONS, placeholder: 'Placeholder Text' },
};

/**
 * Static visual reference only — NOT the real component. Native <select> open
 * menus are OS-drawn and can't be styled to match this mockup; see Select's
 * doc comment for why a full custom listbox wasn't built for this change. The
 * highlighted-option fill uses `bg-form-filter` as a labeled placeholder — the
 * spec never gives a hex for this highlight, it's only visible in the PDF
 * mockup.
 */
export const OpenMenuVisualMockup: Story = {
  decorators: [],
  render: () => (
    <div className="w-72">
      <p className="mb-1 text-body font-medium text-ink-primary">Select with Options</p>
      <div className="rounded-lg border border-line-field bg-white px-3 py-4 text-body text-ink-placeholder">
        Placeholder Text
      </div>
      <ul className="mt-2 rounded-lg border border-line-field bg-white py-1 shadow-xl">
        {OPTIONS.map((option, index) => (
          <li
            key={option.value}
            className={`px-3 py-2 text-body ${
              index === 0 ? 'bg-form-filter text-ink-blue-label' : 'text-ink-primary'
            }`}
          >
            {option.label}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-caption text-ink-secondary">
        Placeholder highlight color (bg-form-filter) — not a spec-given hex. See the token migration
        report.
      </p>
    </div>
  ),
};
