import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { axe } from 'jest-axe';
import { Checkbox } from './Checkbox';

function renderField() {
  return render(
    <Formik
      initialValues={{ agree: false }}
      validationSchema={Yup.object({
        agree: Yup.boolean().oneOf([true], 'You must agree to continue'),
      })}
      onSubmit={() => {}}
    >
      <Form>
        <Checkbox name="agree" label="I agree to the terms" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>,
  );
}

describe('Checkbox', () => {
  it('shows a Yup validation error after a failed submit', async () => {
    renderField();

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('You must agree to continue');
    expect(screen.getByLabelText('I agree to the terms')).toHaveAttribute('aria-invalid', 'true');
  });

  it('toggles on click', async () => {
    renderField();

    const checkbox = screen.getByLabelText('I agree to the terms');
    await userEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderField();
    // jest-axe's custom matcher isn't type-augmented on Vitest's Assertion
    // (see src/types/jest-axe.d.ts) — safe at runtime via src/test/setup.ts.
    // @ts-expect-error -- see comment above
    expect(await axe(container)).toHaveNoViolations(); // eslint-disable-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  });
});
