import type { Meta, StoryObj } from '@storybook/react';
import type { ColDef } from 'ag-grid-community';
import { DataGrid } from './DataGrid';

interface SampleRow {
  reference: string;
  applicant: string;
  premium: number;
  effectiveDate: string;
}

const columnDefs: ColDef<SampleRow>[] = [
  { field: 'reference', headerName: 'Reference', sortable: true },
  { field: 'applicant', headerName: 'Applicant', flex: 1, sortable: true, filter: true },
  { field: 'premium', headerName: 'Premium', sortable: true },
  { field: 'effectiveDate', headerName: 'Effective', sortable: true },
];

const rowData: SampleRow[] = [
  { reference: 'Q-1001', applicant: 'Jordan Lee', premium: 1285, effectiveDate: '2026-09-01' },
  { reference: 'Q-1002', applicant: 'Casey Morgan', premium: 960, effectiveDate: '2026-09-15' },
  { reference: 'Q-1003', applicant: 'Priya Raman', premium: 2140, effectiveDate: '2026-10-01' },
];

const meta: Meta<typeof DataGrid<SampleRow>> = {
  title: 'UI/DataGrid',
  component: DataGrid,
  parameters: {
    layout: 'padded',
    // AG Grid's own DOM raises axe findings this wrapper does not control; the
    // grid's keyboard behavior is verified manually and in feature-level tests.
    // Documented exception per .claude/rules/accessibility.md.
    a11y: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof DataGrid<SampleRow>>;

export const Default: Story = { args: { rowData, columnDefs, height: 320 } };

export const Loading: Story = {
  args: { rowData: [], columnDefs, loading: true, height: 320 },
};

export const Empty: Story = { args: { rowData: [], columnDefs, height: 320 } };

export const ManyRows: Story = {
  args: {
    columnDefs,
    height: 420,
    rowData: Array.from({ length: 120 }, (_, index) => ({
      reference: `Q-${2000 + index}`,
      applicant: `Applicant ${index + 1}`,
      premium: 800 + index * 13,
      effectiveDate: '2026-09-01',
    })),
  },
};
