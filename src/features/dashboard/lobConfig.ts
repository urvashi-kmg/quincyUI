export type LobId =
  | 'all'
  | 'ma-personal'
  | 'ma-comm'
  | 'commercial'
  | 'home'
  | 'business'
  | 'dwelling';

export interface LobMapping {
  totalPoliciesName: string;
  writtenPremiumMonth: string;
  lossRatioMonth: string;
}

/**
 * Maps a LOB filter pill to the per-chart data-row names it should highlight
 * (ported from the source dashboard — .claude/rules/components.md: chart
 * config colocated rather than duplicated per page).
 */
export const LOB_MAP: Partial<Record<LobId, LobMapping>> = {
  home: {
    totalPoliciesName: 'Home Owners',
    writtenPremiumMonth: 'Home Owners',
    lossRatioMonth: 'Home Owners',
  },
  business: {
    totalPoliciesName: 'Business Owners',
    writtenPremiumMonth: 'Business Owners',
    lossRatioMonth: 'Business Owners',
  },
  'ma-personal': {
    totalPoliciesName: 'MA Personal Auto',
    writtenPremiumMonth: 'MA Personal Auto',
    lossRatioMonth: 'MA Personal Auto',
  },
  'ma-comm': {
    totalPoliciesName: 'MA Commercial Auto',
    writtenPremiumMonth: 'MA Commercial Auto',
    lossRatioMonth: 'MA Commercial Auto',
  },
  commercial: {
    totalPoliciesName: 'Personal Auto',
    writtenPremiumMonth: 'Auto',
    lossRatioMonth: 'Personal Auto',
  },
  dwelling: {
    totalPoliciesName: 'Dwelling Fire',
    writtenPremiumMonth: 'Dwelling Fire',
    lossRatioMonth: 'Dwelling Fire',
  },
};
