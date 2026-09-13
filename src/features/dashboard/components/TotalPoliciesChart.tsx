import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppSelector } from '@/redux/hooks';
import { ChartCard, ChartDropdown } from './ChartCard';
import { LegendDot } from './LegendDot';
import { AGENT_OPTIONS, STATE_OPTIONS } from '../filterOptions';
import { selectDashboardLob } from '../stores/dashboardSlice';
import { LOB_MAP } from '../lobConfig';
import totalPoliciesData from '../data/totalPoliciesData.json';

/**
 * Donut of policy counts by LOB. Accessibility: the chart is not the only
 * conveyance of this data — a screen-reader table accompanies it
 * (.claude/rules/accessibility.md), and the legend segments already carry
 * the same labels/values shown visually so color is never the only signal.
 */
export function TotalPoliciesChart() {
  const [agent, setAgent] = useState('all-gall');
  const [state, setState] = useState('all');

  const lob = useAppSelector(selectDashboardLob);
  const mapping = LOB_MAP[lob];
  const activeName = mapping?.totalPoliciesName ?? null;

  const { center, segments } = totalPoliciesData;
  const activeSegment = activeName ? segments.find((s) => s.name === activeName) : null;
  const displayCenter = activeSegment ? activeSegment.count.toLocaleString() : center.toLocaleString();

  return (
    <ChartCard
      title="Total Policies"
      filters={
        <>
          <ChartDropdown label="Agent" value={agent} onChange={setAgent} options={AGENT_OPTIONS} />
          <ChartDropdown label="State" value={state} onChange={setState} options={STATE_OPTIONS} side="right" />
        </>
      }
    >
      <div className="flex items-center gap-3 px-1 py-2 2xl:gap-4 2xl:py-3" aria-hidden="true">
        <ul className="flex flex-1 flex-col justify-center gap-3 2xl:gap-4">
          {segments.slice(0, 4).map((segment) => {
            const isActive = !activeName || segment.name === activeName;
            return (
              <li
                key={segment.name}
                className={`flex items-center justify-end gap-1.5 2xl:gap-2 ${isActive ? 'opacity-100' : 'opacity-25'}`}
              >
                <div className="min-w-0 text-right">
                  <p className="truncate text-small leading-tight font-medium text-ink-primary">{segment.name}</p>
                  <p className="text-caption leading-tight text-ink-secondary">{segment.value}%</p>
                </div>
                <LegendDot color={segment.color} />
              </li>
            );
          })}
        </ul>

        <div className="relative h-56 w-56 flex-shrink-0 2xl:h-[280px] 2xl:w-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={segments}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={107}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                strokeWidth={0}
                isAnimationActive={false}
              >
                {segments.map((segment, index) => (
                  <Cell
                    key={index}
                    fill={segment.color}
                    fillOpacity={!activeName || segment.name === activeName ? 1 : 0.15}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${String(value)}%`, '']} cursor={false} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 2xl:gap-1">
            <span className="text-[24px] leading-none font-bold text-ink-primary">{displayCenter}</span>
            {activeSegment && (
              <span className="px-2 text-center text-caption leading-tight text-ink-secondary">
                {activeSegment.name}
              </span>
            )}
          </div>
        </div>

        <ul className="flex flex-1 flex-col justify-center gap-3 2xl:gap-4">
          {segments.slice(4).map((segment) => {
            const isActive = !activeName || segment.name === activeName;
            return (
              <li
                key={segment.name}
                className={`flex items-center gap-1.5 2xl:gap-2 ${isActive ? 'opacity-100' : 'opacity-25'}`}
              >
                <LegendDot color={segment.color} />
                <div className="min-w-0">
                  <p className="truncate text-small leading-tight font-medium text-ink-primary">{segment.name}</p>
                  <p className="text-caption leading-tight text-ink-secondary">{segment.value}%</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <table className="sr-only">
        <caption>Total policies by line of business</caption>
        <thead>
          <tr>
            <th scope="col">Line of business</th>
            <th scope="col">Share</th>
            <th scope="col">Policy count</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((segment) => (
            <tr key={segment.name}>
              <th scope="row">{segment.name}</th>
              <td>{segment.value}%</td>
              <td>{segment.count.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ChartCard>
  );
}
