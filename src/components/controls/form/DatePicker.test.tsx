import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { axe } from 'jest-axe';
import { DatePicker } from './DatePicker';

function renderField() {
  return render(
    <Formik
      initialValues={{ effectiveDate: '' }}
      validationSchema={Yup.object({
        effectiveDate: Yup.string().required('Effective date is required'),
      })}
      onSubmit={() => {}}
    >
      <Form>
        <DatePicker name="effectiveDate" label="Effective date" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>,
  );
}

describe('DatePicker', () => {
  it('shows a Yup validation error after a failed submit', async () => {
    renderField();

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Effective date is required');
    expect(screen.getByLabelText('Effective date')).toHaveAttribute('aria-invalid', 'true');
  });

  it('accepts a typed date value', async () => {
    renderField();

    const input = screen.getByLabelText('Effective date');
    await userEvent.type(input, '2026-01-15');

    expect(input).toHaveValue('2026-01-15');
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderField();
    expect(await axe(container)).toHaveNoViolations();
  });
});
