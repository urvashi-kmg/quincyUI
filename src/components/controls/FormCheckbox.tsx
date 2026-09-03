import { useField } from 'formik';
import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface FormCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label: string;
}

// Formik-bound checkbox. Uses useField's checkbox handling (Formik reads
// the `checked` value automatically for type="checkbox" fields).
export function FormCheckbox({ name, label, className, ...rest }: FormCheckboxProps) {
  const [field] = useField({ name, type: 'checkbox' });

  return (
    <label htmlFor={name} className={clsx('flex select-none items-center gap-2 text-sm text-slate-600', className)}>
      <input
        id={name}
        type="checkbox"
        {...field}
        {...rest}
        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-500/30"
      />
      {label}
    </label>
  );
}
