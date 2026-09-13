import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { axe } from 'jest-axe';
import { Select } from './Select';

const OPTIONS = [
  { value: 'underwriters', label: 'CL Underwriters' },
  { value: 'operations', label: 'CL Operations' },
];

function renderField() {
  return render(
    <Formik
      initialValues={{ team: '' }}
      validationSchema={Yup.object({ team: Yup.string().required('Team is required') })}
      onSubmit={() => {}}
    >
      <Form>
        <Select name="team" label="Team" options={OPTIONS} placeholder="Select a team" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>,
  );
}

describe('Select', () => {
  it('shows a Yup validation error after a failed submit', async () => {
    renderField();

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Team is required');
    expect(screen.getByLabelText('Team')).toHaveAttribute('aria-invalid', 'true');
  });

  it('lets the user choose an option', async () => {
    renderField();

    await userEvent.selectOptions(screen.getByLabelText('Team'), 'operations');

    expect(screen.getByLabelText('Team')).toHaveValue('operations');
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderField();
    // jest-axe's custom matcher isn't type-augmented on Vitest's Assertion
    // (see src/types/jest-axe.d.ts) — safe at runtime via src/test/setup.ts.
    // @ts-expect-error -- see comment above
    expect(await axe(container)).toHaveNoViolations(); // eslint-disable-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  });
});
