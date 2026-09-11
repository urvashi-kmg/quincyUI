import { useField } from 'formik';
import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  name: string;
  label: string;
  helpText?: string;
  isSuccess?: boolean;
}

/**
 * Shared Formik-bound textarea, styled per Form Fields.pdf 2.9. See
 * TextField's doc comment for the disabled/success-state rationale, which
 * applies identically here.
 */
export function Textarea({
  name,
  label,
  helpText,
  isSuccess = false,
  id,
  className = '',
  rows = 4,
  ...rest
}: TextareaProps) {
  const [field, meta] = useField(name);
  const textareaId = id ?? `field-${name}`;
  const errorId = `${textareaId}-error`;
  const helpId = `${textareaId}-help`;
  const hasError = Boolean(meta.touched && meta.error);
  const status = hasError ? 'error' : isSuccess ? 'success' : 'default';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={textareaId} className="text-body font-medium text-ink-primary">
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
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
