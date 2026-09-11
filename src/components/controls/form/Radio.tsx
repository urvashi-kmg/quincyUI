import { useField } from 'formik';
import type { InputHTMLAttributes } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  name: string;
  label: string;
  value: string;
}

/**
 * Shared Formik-bound radio button. See Checkbox's doc comment — the same
 * "no size/shape/color given for checkbox/radio" gap applies here, resolved
 * the same way (native input, tinted via `accent-*`).
 */
export function Radio({ name, label, value, id, className = '', ...rest }: RadioProps) {
  const [field] = useField({ name, type: 'radio', value });
  const inputId = id ?? `field-${name}-${value}`;

  return (
    <div className="flex items-center gap-2">
      <input
        id={inputId}
        type="radio"
        {...field}
        {...rest}
        className={`h-4 w-4 border-line-field accent-brand-purple disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      />
      <label htmlFor={inputId} className="text-body font-medium text-ink-primary">
        {label}
      </label>
    </div>
  );
}
