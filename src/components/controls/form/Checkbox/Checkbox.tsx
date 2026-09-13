import { useField } from 'formik';
import type { InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'type'
> {
  name: string;
  label: string;
  helpText?: string;
}

/**
 * Shared Formik-bound checkbox.
 *
 * Form Fields.pdf 2.9 lists checkbox/radio under its global properties
 * (padding, border-radius, placeholder color) but those describe text-entry
 * fields — no checkbox/radio size, shape, or per-state color is given
 * anywhere in the spec (see the "missing values" list in the token migration
 * report). Rather than invent a custom box size/shape, this uses the native
 * checkbox tinted via Tailwind's `accent-*` utility with the one color we do
 * have (brand purple) — native rendering keeps correct keyboard/a11y
 * behavior for free. Revisit once design specifies real checkbox artwork.
 */
export function Checkbox({ name, label, helpText, id, className = '', ...rest }: CheckboxProps) {
  const [field, meta] = useField({ name, type: 'checkbox' });
  const inputId = id ?? `field-${name}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="checkbox"
          {...field}
          {...rest}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : helpText ? helpId : undefined}
          className={`h-4 w-4 rounded border-line-field accent-brand-purple disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        />
        <label htmlFor={inputId} className="text-body font-medium text-ink-primary">
          {label}
        </label>
      </div>
      {helpText && !hasError && (
        <p id={helpId} className="text-small text-ink-secondary">
          {helpText}
        </p>
      )}
      {hasError && (
        <p id={errorId} role="alert" className="text-small text-ink-error">
          {meta.error}
        </p>
      )}
    </div>
  );
}
