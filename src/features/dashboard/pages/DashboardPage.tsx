import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loadDashboardSummary } from '../stores/dashboardSlice';
import { PremiumTrendChart } from '../components/PremiumTrendChart';
import { formatCurrency } from '@/utils/formatters';

/**
 * Route-level page: composes feature state + presentational components.
 * No raw Axios/fetch here — data comes through the Redux slice/service.
 */
export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(loadDashboardSummary());
    }
  }, [status, dispatch]);

  if (status === 'loading' || status === 'idle') {
    return <p className="text-sm text-slate-500">Loading dashboard…</p>;
  }

  if (status === 'failed') {
    return (
      <p role="alert" className="text-sm text-red-600">
        Couldn&apos;t load the dashboard: {error}
      </p>
    );
  }

  if (!data) {
    return <p className="text-sm text-slate-500">No dashboard data yet.</p>;
  }

  const cards = [
    { label: 'Open quotes', value: data.openQuotes },
    { label: 'Active policies', value: data.activePolicies },
    { label: 'Pending renewals', value: data.pendingRenewals },
    { label: 'Premium written', value: formatCurrency(data.premiumWrittenCents) },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Dashboard</h1>

      <dl className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-card border border-border-light bg-white p-4 dark:border-border-dark dark:bg-muted-dark"
          >
            <dt className="text-sm text-slate-500">{card.label}</dt>
            <dd className="mt-1 text-2xl font-semibold">{card.value}</dd>
          </div>
        ))}
      </dl>

      <section className="max-w-3xl rounded-card border border-border-light bg-white p-4 dark:border-border-dark dark:bg-muted-dark">
        <PremiumTrendChart data={data.premiumTrend} />
      </section>
    </div>
  );
}
