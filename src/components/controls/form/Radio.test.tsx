import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik, Form } from 'formik';
import { axe } from 'jest-axe';
import { Radio } from './Radio';

function renderField() {
  return render(
    <Formik initialValues={{ plan: 'monthly' }} onSubmit={() => {}}>
      <Form>
        <Radio name="plan" value="monthly" label="Monthly" />
        <Radio name="plan" value="annual" label="Annual" />
      </Form>
    </Formik>,
  );
}

describe('Radio', () => {
  it('selects the initial value from Formik state', () => {
    renderField();

    expect(screen.getByLabelText('Monthly')).toBeChecked();
    expect(screen.getByLabelText('Annual')).not.toBeChecked();
  });

  it('switches selection within the group on click', async () => {
    renderField();

    await userEvent.click(screen.getByLabelText('Annual'));

    expect(screen.getByLabelText('Annual')).toBeChecked();
    expect(screen.getByLabelText('Monthly')).not.toBeChecked();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderField();
    expect(await axe(container)).toHaveNoViolations();
  });
});
