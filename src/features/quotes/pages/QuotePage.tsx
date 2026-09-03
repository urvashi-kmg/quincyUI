import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@components/ui';

import { useGetQuotesQuery } from '../services/quotesApi';
import type { Quote } from '../types';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function QuotePage() {
  const { data: quotes, isLoading, isError } = useGetQuotesQuery();
  const navigate = useNavigate();

  const columnDefs = useMemo<ColDef<Quote>[]>(
    () => [
      { field: 'quoteNumber', headerName: 'Quote #', flex: 1 },
      { field: 'applicantName', headerName: 'Applicant', flex: 1.5 },
      { field: 'productLine', headerName: 'Product', flex: 1 },
      {
        field: 'premium',
        headerName: 'Premium',
        flex: 1,
        valueFormatter: ({ value }) =>
          typeof value === 'number' ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '',
      },
      { field: 'status', headerName: 'Status', flex: 1 },
    ],
    [],
  );

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Quotes</h1>
        <Button onClick={() => navigate('/quotes/new/review')}>New Quote</Button>
      </div>

      {isError && <p className="text-signal-red">Failed to load quotes. Please try again.</p>}

      <div className="ag-theme-quincy h-[calc(100%-3rem)] w-full">
        <AgGridReact<Quote>
          rowData={quotes ?? []}
          columnDefs={columnDefs}
          loading={isLoading}
          pagination
          paginationPageSize={20}
        />
      </div>
    </div>
  );
}
