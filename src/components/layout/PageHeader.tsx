import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * Presentational page heading. Lives in components/layout because it takes
 * everything via props and touches no feature state — unlike the connected
 * app shell, which lives in src/app (.claude/rules/components.md).
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}
