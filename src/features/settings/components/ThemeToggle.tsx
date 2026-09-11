import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const options = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
] as const;

/**
 * Radio group rather than a toggle button, so the current choice is announced
 * and both options are reachable (.claude/rules/accessibility.md).
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Monitor size={16} aria-hidden="true" />
        Theme
      </legend>
      <div className="flex gap-4">
        {options.map(({ value, label, icon: Icon }) => (
          <label key={value} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="theme"
              value={value}
              checked={theme === value}
              onChange={() => setTheme(value)}
              className="accent-brand-500"
            />
            <Icon size={14} aria-hidden="true" />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
