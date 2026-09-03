import { useField } from 'formik';
import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  /** Optional leading icon rendered inside the input, left-aligned. */
  icon?: LucideIcon;
}

// Formik + Yup binding for a plain text/number/date input. Errors only
// surface after the field has been touched, per standard Formik UX.
export function FormField({ name, label, icon: Icon, className, ...rest }: FormFieldProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-600">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        )}
        <input
          id={name}
          {...field}
          {...rest}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          className={clsx(
            'h-11 w-full rounded-lg border bg-white text-sm text-slate-900 placeholder:text-slate-400',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
            Icon ? 'pl-10 pr-3' : 'px-3',
            hasError
              ? 'border-signal-red focus:border-signal-red focus:ring-signal-red/20'
              : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20',
            className,
          )}
        />
      </div>
      {hasError && (
        <span id={`${name}-error`} className="text-xs text-signal-red">
          {meta.error}
        </span>
      )}
    </div>
  );
}
