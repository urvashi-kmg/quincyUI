import { SETTINGS_SECTIONS } from '../data/settingsSections';

/**
 * No section is implemented yet. Profile and Notifications require API
 * contracts that were not specified — see Rule Zero.
 */
export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-heading-2 font-semibold">Settings</h1>

      {SETTINGS_SECTIONS.map((section) => (
        <section
          key={section.id}
          aria-labelledby={`settings-${section.id}`}
          className="mb-6 rounded-card border border-line-decorative p-4"
        >
          <h2 id={`settings-${section.id}`} className="text-body font-medium">
            {section.label}
          </h2>
          <p className="mb-3 text-small text-ink-secondary">{section.description}</p>

          {/* The spec gives only two text tones (primary/secondary) — no
           * third, lighter tone exists for this previously slate-400 "muted"
           * text, so it now reads the same as the description above it. */}
          <p className="text-small text-ink-secondary">Not yet available.</p>
        </section>
      ))}
    </div>
  );
}
