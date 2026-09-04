import { useParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useGetQuoteByIdQuery } from '../services/quotesApi';

// Placeholder premium breakdown until the real underwriting rating factors
// are wired up — demonstrates the Recharts pattern for this codebase.
const PREMIUM_BREAKDOWN = [
  { factor: 'Base', amount: 620 },
  { factor: 'Driver risk', amount: 180 },
  { factor: 'Vehicle', amount: 140 },
  { factor: 'Coverage', amount: 260 },
  { factor: 'Discounts', amount: -90 },
];

export default function QuoteReviewPage() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const isNewQuote = !quoteId || quoteId === 'new';
  const {
    data: quote,
    isLoading,
    isError,
  } = useGetQuoteByIdQuery(quoteId ?? '', { skip: isNewQuote });

  if (isLoading) return <p className="text-slate-500">Loading…</p>;
  if (isError) return <p className="text-signal-red">Failed to load quote. Please try again.</p>;
  if (!isNewQuote && !quote) return <p className="text-slate-500">Quote not found.</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-900">
        Quote review {quote ? `— ${quote.quoteNumber}` : ''}
      </h1>

      <div className="h-72 rounded bg-white p-4 shadow-card">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={PREMIUM_BREAKDOWN}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis dataKey="factor" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="amount" fill="#1a3f70" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
