import { AgGridReact, type AgGridReactProps } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

export interface DataGridProps<T> extends AgGridReactProps<T> {
  /** Fixed height in pixels; AG Grid requires a bounded container height. */
  height?: number;
}

/**
 * Shared AG Grid wrapper carrying Quincy-UI's default theme/options.
 * Feature grids should use this instead of importing AgGridReact directly —
 * see .claude/rules/components.md.
 */
export function DataGrid<T>({ height = 480, ...gridProps }: DataGridProps<T>) {
  return (
    // eslint-disable-next-line react/forbid-dom-props -- AG Grid requires a
    // bounded, dynamic pixel height that cannot be expressed as a static
    // Tailwind class; documented exception per .claude/rules/styling.md.
    <div className="ag-theme-quartz" style={{ height }}>
      <AgGridReact<T>
        pagination
        paginationPageSize={25}
        suppressCellFocus={false}
        animateRows
        {...gridProps}
      />
    </div>
  );
}
