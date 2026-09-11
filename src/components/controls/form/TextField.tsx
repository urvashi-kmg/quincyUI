import { useField } from 'formik';
import type { InputHTMLAttributes } from 'react';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  label: string;
  helpText?: string;
}

/**
 * Shared Formik-bound text field. Errors are associated to the input via
 * aria-describedby — see .claude/rules/accessibility.md.
 */
export function TextField({ name, label, helpText, id, ...rest }: TextFieldProps) {
  const [field, meta] = useField(name);
  const inputId = id ?? `field-${name}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={inputId}
        {...field}
        {...rest}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : helpText ? helpId : undefined}
        className={`h-10 rounded-card border px-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 ${
          hasError
            ? 'border-red-500 focus-visible:outline-red-500'
            : 'border-border-light focus-visible:outline-brand-500'
        }`}
      />
      {helpText && !hasError && (
        <p id={helpId} className="text-xs text-slate-500">
          {helpText}
        </p>
      )}
      {hasError && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {meta.error}
        </p>
      )}
    </div>
  );
}
