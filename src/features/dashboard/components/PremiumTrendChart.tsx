import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '@/utils/formatters';

export interface PremiumTrendPoint {
  month: string;
  premiumCents: number;
  policyCount: number;
}

export interface PremiumTrendChartProps {
  data: readonly PremiumTrendPoint[];
}

function formatMonthLabel(month: string): string {
  const [year, monthPart] = month.split('-');
  if (!year || !monthPart) return month;
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
    new Date(Number(year), Number(monthPart) - 1, 1),
  );
}

/**
 * Chart config is colocated with the chart component rather than duplicated
 * per page (.claude/rules/components.md). Derived data is memoized because the
 * formatting cost scales with row count (.claude/rules/performance.md).
 *
 * Accessibility: the chart is not the only conveyance of this data — a
 * screen-reader table accompanies it (.claude/rules/accessibility.md).
 */
export function PremiumTrendChart({ data }: PremiumTrendChartProps) {
  const chartData = useMemo(
    () =>
      data.map((point) => ({
        ...point,
        label: formatMonthLabel(point.month),
        premium: point.premiumCents / 100,
      })),
    [data],
  );

  if (data.length === 0) {
    return (
      <p className="text-small text-ink-secondary">
        No premium history for the selected period yet.
      </p>
    );
  }

  return (
    <figure className="m-0">
      <figcaption className="mb-2 text-small font-medium text-ink-primary">
        Premium written by month
      </figcaption>

      <div className="h-72 w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-line-decorative" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value * 100)}
              labelFormatter={(label: string) => `Month: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="premium"
              stroke="#2158f5"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Text equivalent: keeps the data reachable when the SVG is not. */}
      <table className="sr-only">
        <caption>Premium written by month</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Premium written</th>
            <th scope="col">Policies</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((point) => (
            <tr key={point.month}>
              <th scope="row">{point.label}</th>
              <td>{formatCurrency(point.premiumCents)}</td>
              <td>{point.policyCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
