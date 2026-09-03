import { useField } from 'formik';
import clsx from 'clsx';
import type { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  options: Option[];
}

export function FormSelect({ name, label, options, className, ...rest }: FormSelectProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={name}
        {...field}
        {...rest}
        aria-invalid={hasError}
        className={clsx(
          'h-10 rounded border bg-white px-3 text-sm',
          hasError ? 'border-signal-red' : 'border-slate-300',
          className,
        )}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hasError && <span className="text-xs text-signal-red">{meta.error}</span>}
    </div>
  );
}
