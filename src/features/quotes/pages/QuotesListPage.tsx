import { useEffect, useMemo } from 'react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { DataGrid } from '@/components/ui/DataGrid/DataGrid';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loadQuotes } from '../stores/quotesSlice';
import { QuoteStatusBadge } from '../components/QuoteStatusBadge';
import type { Quote } from '../services/quotesService';
import { formatCurrency, formatDate } from '@/utils/formatters';

const columnDefs: ColDef<Quote>[] = [
  { field: 'applicantName', headerName: 'Applicant', flex: 1, sortable: true, filter: true },
  {
    field: 'premiumCents',
    headerName: 'Premium',
    sortable: true,
    valueFormatter: (params) => formatCurrency(params.value as number),
  },
  {
    field: 'status',
    headerName: 'Status',
    sortable: true,
    cellRenderer: (params: ICellRendererParams<Quote>) =>
      params.data ? <QuoteStatusBadge status={params.data.status} /> : null,
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    sortable: true,
    valueFormatter: (params) => formatDate(params.value as string),
  },
];

/**
 * Column defs are colocated with the page that owns them rather than scattered
 * inline (.claude/rules/components.md), and the grid itself comes from the
 * shared DataGrid wrapper so theme/pagination defaults stay consistent.
 */
export default function QuotesListPage() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.quotes);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(loadQuotes({}));
    }
  }, [status, dispatch]);

  const rowData = useMemo(() => data?.items ?? [], [data]);

  if (status === 'failed') {
    return (
      <p role="alert" className="text-sm text-red-600">
        Couldn&apos;t load quotes: {error}
      </p>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Quotes</h1>
      <DataGrid<Quote>
        rowData={rowData}
        columnDefs={columnDefs}
        loading={status === 'loading' || status === 'idle'}
        height={560}
      />
    </div>
  );
}
