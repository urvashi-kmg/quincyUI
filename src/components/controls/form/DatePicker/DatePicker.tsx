import { useField } from 'formik';
import type { InputHTMLAttributes } from 'react';
import { Calendar } from 'lucide-react';

export interface DatePickerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'type'
> {
  name: string;
  label: string;
  helpText?: string;
  isSuccess?: boolean;
}

/**
 * Shared Formik-bound date field, styled per Form Fields.pdf 2.9.
 *
 * Uses native <input type="date"> rather than a custom calendar widget —
 * no date library (date-fns/dayjs/etc.) is installed, and adding one for a
 * single field is a new-dependency decision this change doesn't have
 * approval for (.claude/rules/security.md). Native date inputs also come
 * with correct keyboard/locale/screen-reader behavior for free.
 *
 * The spec calls for a trailing calendar icon on every date field. Chrome
 * already draws its own calendar-picker indicator inside the field; it's
 * made transparent-but-still-clickable here so our icon renders in its place
 * without doubling up. Firefox/Safari don't expose that pseudo-element, so
 * on those browsers the native affordance (if any) may sit alongside ours —
 * a known cross-browser limitation of this approach, not a hex/color gap.
 */
export function DatePicker({
  name,
  label,
  helpText,
  isSuccess = false,
  id,
  className = '',
  ...rest
}: DatePickerProps) {
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
      <div className="relative">
        <input
          id={inputId}
          type="date"
          {...field}
          {...rest}
          data-status={status}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : helpText ? helpId : undefined}
          className={`w-full rounded-lg border px-3 py-4 pr-10 text-body text-ink-primary outline-none transition-colors [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 focus:border-brand-purple disabled:cursor-not-allowed disabled:opacity-60 ${
            status === 'error' ? 'border-line-error bg-fill-error' : 'border-line-field'
          } ${className}`}
        />
        <Calendar
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
