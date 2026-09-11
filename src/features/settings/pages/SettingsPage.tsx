import { SETTINGS_SECTIONS } from '../data/settingsSections';
import { ThemeToggle } from '../components/ThemeToggle';

/**
 * Only the Appearance section is implemented. Profile and Notifications
 * require API contracts that were not specified — see Rule Zero.
 */
export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold">Settings</h1>

      {SETTINGS_SECTIONS.map((section) => (
        <section
          key={section.id}
          aria-labelledby={`settings-${section.id}`}
          className="mb-6 rounded-card border border-border-light p-4 dark:border-border-dark"
        >
          <h2 id={`settings-${section.id}`} className="text-base font-medium">
            {section.label}
          </h2>
          <p className="mb-3 text-sm text-slate-500">{section.description}</p>

          {section.id === 'appearance' ? (
            <ThemeToggle />
          ) : (
            <p className="text-sm text-slate-400">Not yet available.</p>
          )}
        </section>
      ))}
    </div>
  );
}
