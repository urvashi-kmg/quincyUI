/** Navigation model for the settings page. Feature-local by design. */
export interface SettingsSection {
  id: string;
  label: string;
  description: string;
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  { id: 'profile', label: 'Profile', description: 'Your name, email and contact preferences.' },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Which events send you an alert.',
  },
];
