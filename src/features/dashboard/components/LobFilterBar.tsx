import type { ElementType } from 'react';
import { Car, Truck, Bus, Home, Building2, Flame } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectDashboardLob, setLob } from '../stores/dashboardSlice';
import type { LobId } from '../lobConfig';

const LOB_OPTIONS: { id: LobId; label: string; Icon: ElementType | null }[] = [
  { id: 'all', label: 'All Lobs', Icon: null },
  { id: 'ma-personal', label: 'MA Personal Auto', Icon: Car },
  { id: 'ma-comm', label: 'MA Commercial Auto', Icon: Truck },
  { id: 'commercial', label: 'Personal Auto', Icon: Bus },
  { id: 'home', label: 'Home Owners', Icon: Home },
  { id: 'business', label: 'Business Owners', Icon: Building2 },
  { id: 'dwelling', label: 'Dwelling Fire', Icon: Flame },
];

/** Line-of-business filter pills. Selecting one highlights the matching data
 * row across every chart on the dashboard (see lobConfig.ts's LOB_MAP). */
export function LobFilterBar() {
  const dispatch = useAppDispatch();
  const lob = useAppSelector(selectDashboardLob);

  return (
    <div
      role="group"
      aria-label="Filter dashboard by line of business"
      className="flex items-center gap-2 rounded-card border border-line-decorative bg-white px-4 py-2.5 2xl:gap-3 2xl:px-6 2xl:py-3"
    >
      {LOB_OPTIONS.map(({ id, label, Icon }) => {
        const isSelected = lob === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => dispatch(setLob(id))}
            className={`flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-small font-medium transition-all 2xl:gap-2 2xl:px-4 2xl:py-2.5 ${
              id === 'all' ? 'flex-1' : ''
            } ${
              isSelected
                ? 'bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-md'
                : 'bg-muted text-ink-secondary hover:text-ink-primary'
            }`}
          >
            {Icon && (
              <Icon
                size={14}
                strokeWidth={2}
                aria-hidden="true"
                className={isSelected ? 'text-white' : 'text-brand-pink'}
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
