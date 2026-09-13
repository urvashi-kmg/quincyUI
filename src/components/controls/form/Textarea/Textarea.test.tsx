import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { axe } from 'jest-axe';
import { Textarea } from './Textarea';

function renderField() {
  return render(
    <Formik
      initialValues={{ notes: '' }}
      validationSchema={Yup.object({ notes: Yup.string().required('Notes are required') })}
      onSubmit={() => {}}
    >
      <Form>
        <Textarea name="notes" label="Notes" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>,
  );
}

describe('Textarea', () => {
  it('shows a Yup validation error after a failed submit', async () => {
    renderField();

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Notes are required');
    expect(screen.getByLabelText('Notes')).toHaveAttribute('aria-invalid', 'true');
  });

  it('accepts typed input', async () => {
    renderField();

    await userEvent.type(screen.getByLabelText('Notes'), 'Follow up next week');

    expect(screen.getByLabelText('Notes')).toHaveValue('Follow up next week');
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderField();
    // jest-axe's custom matcher isn't type-augmented on Vitest's Assertion
    // (see src/types/jest-axe.d.ts) — safe at runtime via src/test/setup.ts.
    // @ts-expect-error -- see comment above
    expect(await axe(container)).toHaveNoViolations(); // eslint-disable-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  });
});
