import type { PremiumTrendPoint } from '../components/PremiumTrendChart';

/**
 * Sample data for Storybook stories and tests only. Production data comes from
 * the dashboard service — never import this from a page or component.
 */
export const samplePremiumTrend: PremiumTrendPoint[] = [
  { month: '2026-01', premiumCents: 3_120_000, policyCount: 240 },
  { month: '2026-02', premiumCents: 3_480_000, policyCount: 258 },
  { month: '2026-03', premiumCents: 3_310_000, policyCount: 251 },
  { month: '2026-04', premiumCents: 4_020_000, policyCount: 289 },
  { month: '2026-05', premiumCents: 4_460_000, policyCount: 312 },
  { month: '2026-06', premiumCents: 4_280_000, policyCount: 305 },
];
