import { useField } from 'formik';
import type { InputHTMLAttributes } from 'react';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  label: string;
  helpText?: string;
  /**
   * Marks the field as successfully validated. Formik/Yup only express
   * error-or-not, not a positive "success" signal, so the caller opts in
   * explicitly (e.g. after an async availability check) rather than this
   * being inferred from Formik state.
   */
  isSuccess?: boolean;
}

/**
 * Shared Formik-bound text field, styled per Form Fields.pdf 2.9.
 *
 * The "success" fill/border and a distinct disabled fill are not given
 * anywhere in the spec (no green hex exists in the whole design system, and
 * disabled form fields are only shown as "grayed out" with no hex) — see the
 * token migration report's "missing values" list. Disabled reuses the
 * 60%-opacity convention used everywhere else in this same spec (every
 * button variant's disabled state); success currently has no visual
 * treatment and falls back to the default border, tracked via
 * `data-status="success"` so styling can be added later without touching
 * this component again.
 *
 * Errors are associated to the input via aria-describedby — see
 * .claude/rules/accessibility.md.
 */
export function TextField({
  name,
  label,
  helpText,
  isSuccess = false,
  id,
  className = '',
  ...rest
}: TextFieldProps) {
  const [field, meta] = useField(name);
  const inputId = id ?? `field-${name}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;
  const hasError = Boolean(meta.touched && meta.error);
  const status = hasError ? 'error' : isSuccess ? 'success' : 'default';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-body font-medium text-ink-primary">
        {label}
      </label>
      <input
        id={inputId}
        {...field}
        {...rest}
        data-status={status}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : helpText ? helpId : undefined}
        className={`rounded-lg border px-3 py-4 text-body text-ink-primary outline-none transition-colors placeholder:text-ink-placeholder focus:border-brand-purple disabled:cursor-not-allowed disabled:opacity-60 ${
          status === 'error' ? 'border-line-error bg-fill-error' : 'border-line-field'
        } ${className}`}
      />
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
