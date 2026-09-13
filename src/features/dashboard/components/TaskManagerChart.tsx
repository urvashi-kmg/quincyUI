import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartCard } from './ChartCard';
import { CHART_TOOLTIP_CONTAINER_CLASS } from '../chartTokens';
import taskManagerChartData from '../data/taskManagerChartData.json';

/**
 * Simplified from source: source's TaskManagerChart recomputes per-tab/
 * per-company/per-user counts and a "My Tasks" filter by scanning a full
 * task list (tasks.json — ~33k rows, 12.7MB as JSON). Bundling that file
 * into this app's build isn't reasonable (see .claude/rules/performance.md
 * on bundle size), so this chart renders only the pre-aggregated summary
 * already shipped in taskManagerChartData.json. The tab/company/user/policy
 * filters and the "My Tasks" (authSlice.user → userMapping.json) lookup
 * source implemented on top of the full list are not reproduced — see the
 * migration report for the real fix (a backend endpoint returning
 * pre-filtered/aggregated counts).
 */
export function TaskManagerChart() {
  const summary = taskManagerChartData.summary;
  const totalCount = summary.reduce((sum, item) => sum + item.count, 0);

  const COLOR_MAP: Record<string, string> = {
    overdue: '#EF4444',
    open: '#F4BE5E',
    completed: '#7CE7AC',
    referred: '#5E81F4',
  };

  return (
    <ChartCard title="Task Manager">
      <div className="flex flex-col items-center gap-6 py-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="relative h-48 w-48 flex-shrink-0" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={summary}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={86}
                paddingAngle={2}
                dataKey="count"
                startAngle={90}
                endAngle={-270}
                isAnimationActive={false}
              >
                {summary.map((item) => (
                  <Cell key={item.key} fill={COLOR_MAP[item.key] ?? '#9CA3AF'} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0]!.payload as (typeof summary)[number];
                  return (
                    <div className={CHART_TOOLTIP_CONTAINER_CLASS}>
                      <p className="font-semibold text-ink-primary">{item.label}</p>
                      <p>
                        {item.count.toLocaleString()} ({item.percent}%)
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-heading-3 font-bold text-ink-primary">
              {totalCount >= 1000 ? `${(totalCount / 1000).toFixed(1)}K` : totalCount}
            </span>
            <span className="text-caption font-semibold whitespace-nowrap text-ink-secondary">Total Tasks</span>
          </div>
        </div>

        <ul className="w-full flex-1 space-y-2">
          {summary.map((item) => (
            <li key={item.key} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5">
              <span className="flex items-center gap-2.5 text-small font-medium text-ink-primary">
                <svg viewBox="0 0 10 10" aria-hidden="true" className="h-2 w-2 flex-shrink-0">
                  <circle cx="5" cy="5" r="5" fill={COLOR_MAP[item.key] ?? '#9CA3AF'} />
                </svg>
                {item.label}
              </span>
              <span className="text-small font-semibold text-ink-primary">
                {item.count.toLocaleString()} ({item.percent}%)
              </span>
            </li>
          ))}
        </ul>
      </div>

      <table className="sr-only">
        <caption>Task manager summary</caption>
        <thead>
          <tr>
            <th scope="col">Status</th>
            <th scope="col">Count</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((item) => (
            <tr key={item.key}>
              <th scope="row">{item.label}</th>
              <td>{item.count.toLocaleString()}</td>
              <td>{item.percent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ChartCard>
  );
}
