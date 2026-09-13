import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FilterOption } from '../filterOptions';

interface ChartCardProps {
  period?: string;
  title: string;
  children: ReactNode;
  filters?: ReactNode;
  subHeader?: ReactNode;
}

/**
 * Shared chart chrome (card, header, optional filter row) reused by every
 * dashboard chart — .claude/rules/components.md: chart config colocated with
 * the chart, but shared chrome extracted once instead of duplicated per
 * chart. Source's "Detailed View" link and filter-icon button had no
 * behavior (no onClick/real href) and are omitted rather than ported as
 * dead controls, consistent with the rest of this migration.
 */
export function ChartCard({ period = 'Current Year', title, children, filters, subHeader }: ChartCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-card border border-line-decorative bg-white p-3 2xl:gap-3 2xl:p-4">
      <div className="flex flex-col gap-0.5 2xl:gap-1">
        <p className="text-caption leading-tight text-ink-secondary">{period}</p>
        {/* h2, not h3 — DashboardPage's only other heading is its sr-only
            h1, so every chart card title is a direct, parallel section under
            it (axe heading-order: levels must increase by one). */}
        <h2 className="text-small font-semibold text-ink-primary">{title}</h2>
      </div>

      {filters && (
        <div className="flex w-full min-w-0 items-center gap-2 rounded-2xl bg-dashboard-filter px-2 py-2 2xl:gap-3 2xl:px-3 2xl:py-2.5">
          {filters}
        </div>
      )}

      {subHeader}

      {children}
    </div>
  );
}

// ── Custom dropdown ──────────────────────────────────────────────────────────

interface ChartDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  label: string;
  className?: string;
  side?: 'left' | 'right';
}

/**
 * A custom (non-native) dropdown, needed for filter chips styled to match
 * the chart-card chrome — a native <select> can't be restyled this way
 * cross-browser. Built as a real listbox pattern for keyboard/AT support
 * (.claude/rules/accessibility.md) rather than a div-soup click target.
 */
export function ChartDropdown({ value, onChange, options, label, className = '', side = 'left' }: ChartDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    function onOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  return (
    <div ref={ref} className={`relative min-w-0 flex-1 ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-full min-w-0 items-center justify-between gap-1.5 rounded-xl bg-white px-2.5 text-small text-ink-primary transition-colors hover:bg-muted 2xl:h-10 2xl:gap-2"
      >
        <span className="truncate text-left leading-tight">{selected?.label}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`flex-shrink-0 text-ink-secondary transition-transform duration-150 2xl:h-5 2xl:w-5 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className={`absolute top-full z-50 mt-1 max-h-56 min-w-full overflow-y-auto rounded-xl border border-line-decorative bg-white shadow-lg 2xl:mt-2 ${
            side === 'right' ? 'right-0 left-auto' : 'left-0'
          }`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full truncate px-4 py-2.5 text-left text-small transition-colors 2xl:px-5 2xl:py-3 ${
                option.value === value
                  ? 'bg-outlined-secondary-active text-brand-purple'
                  : 'text-ink-primary hover:bg-muted'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
