export interface FilterOption {
  value: string;
  label: string;
}

export const AGENT_OPTIONS: FilterOption[] = [
  { value: 'all-gall', label: 'All Agents (GALL)' },
  { value: 'qmnm', label: 'All Quincy & NEMIC Agents (QMNM)' },
  { value: 'c10', label: 'All Quincy Agents (C10)' },
  { value: 'c10q', label: 'All Quincy Agents Without QMA-Rep 18 (C10Q)' },
  { value: 'c15', label: 'All NEMIC Agents (C15)' },
  { value: 'c20', label: 'All Partners Agents (C20)' },
  { value: 'assumed', label: 'Assumed Reinsurance' },
  { value: 'aqua', label: 'All AQUA Agents (AQUA)' },
  { value: 'aqua-andover', label: 'All AQUA Andover Agents (AQUA)' },
];

export const STATE_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All States' },
  { value: 'MA', label: 'MA' },
  { value: 'CT', label: 'CT' },
  { value: 'RI', label: 'RI' },
  { value: 'ME', label: 'ME' },
];
