import { useField } from 'formik';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  name: string;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  helpText?: string;
  isSuccess?: boolean;
}

/**
 * Shared Formik-bound select, styled per Form Fields.pdf 2.9.
 *
 * Implemented as a native <select> rather than a custom listbox: the spec's
 * "Select with Options" mockup shows a fully custom-styled open menu with a
 * highlighted option, but building an accessible custom listbox (roving
 * focus, typeahead, escape handling) is a new component class this change
 * doesn't have a reviewed a11y-safe implementation or an approved dependency
 * for (see .claude/rules/security.md on new dependencies). A native <select>
 * gives correct keyboard/screen-reader behavior for free; its open-menu
 * rendering is OS-drawn and can't be pixel-matched to the mockup — the
 * Storybook story for that state is a static visual reference only, not this
 * component. Flagged as a deliberate deferral in the report.
 *
 * Success state: see TextField's doc comment — no green hex exists anywhere
 * in the spec, so it currently has no visual treatment.
 */
export function Select({
  name,
  label,
  options,
  placeholder,
  helpText,
  isSuccess = false,
  id,
  className = '',
  ...rest
}: SelectProps) {
  const [field, meta] = useField(name);
  const selectId = id ?? `field-${name}`;
  const errorId = `${selectId}-error`;
  const helpId = `${selectId}-help`;
  const hasError = Boolean(meta.touched && meta.error);
  const status = hasError ? 'error' : isSuccess ? 'success' : 'default';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="text-body font-medium text-ink-primary">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          {...field}
          {...rest}
          data-status={status}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : helpText ? helpId : undefined}
          className={`w-full appearance-none rounded-lg border bg-white px-3 py-4 pr-10 text-body text-ink-primary outline-none transition-colors focus:border-brand-purple disabled:cursor-not-allowed disabled:opacity-60 ${
            status === 'error' ? 'border-line-error bg-fill-error' : 'border-line-field'
          } ${field.value === '' ? 'text-ink-placeholder' : ''} ${className}`}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary"
        />
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
