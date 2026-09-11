import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { axe } from 'jest-axe';
import { TextField } from './TextField';

function renderField() {
  return render(
    <Formik
      initialValues={{ applicantName: '' }}
      validationSchema={Yup.object({
        applicantName: Yup.string().required('Applicant name is required'),
      })}
      onSubmit={() => {}}
    >
      <Form>
        <TextField name="applicantName" label="Applicant name" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>,
  );
}

describe('TextField', () => {
  it('shows a Yup validation error after a failed submit', async () => {
    renderField();

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Applicant name is required');
    expect(screen.getByLabelText('Applicant name')).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears the error once a valid value is entered and submitted again', async () => {
    renderField();

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Applicant name'), 'Jordan Lee');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderField();
    expect(await axe(container)).toHaveNoViolations();
  });
});
