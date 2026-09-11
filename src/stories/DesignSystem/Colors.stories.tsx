import type { Meta, StoryObj } from '@storybook/react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js';
import { getContrastRatio, meetsNonTextContrast, meetsTextContrast } from '@/utils/colorContrast';

/**
 * Reads directly from tailwind.config.js (via Tailwind's own resolveConfig)
 * so these swatches — and their contrast numbers — can't drift from the
 * actual tokens components consume. See CLAUDE.md / the token migration
 * report for the full rationale behind each token and every flagged defect.
 */
const { theme } = resolveConfig(tailwindConfig);
const colors = theme.colors as unknown as Record<string, unknown>;

function resolveToken(token: string): string {
  const parts = token.split('.');
  const key = parts[0] ?? token;
  const shade = parts[1];
  const entry = colors[key];
  if (typeof entry === 'string') return entry;
  if (entry && typeof entry === 'object') {
    return (entry as Record<string, string>)[shade ?? 'DEFAULT'] ?? '#000000';
  }
  return '#000000';
}

interface Swatch {
  name: string;
  token: string;
  /**
   * Literal Tailwind class for the preview box. Tailwind's content scanner is
   * regex-based over raw file text, so a literal class string here is picked
   * up and generates real CSS even though it's read out of a data object
   * rather than typed directly as a className — this is what keeps the
   * swatch visually live without resorting to a forbidden inline `style`
   * (`react/forbid-dom-props`) for a runtime-computed hex.
   */
  bgClass: string;
  usage: string;
}

const BRAND: Swatch[] = [
  {
    name: 'Primary Purple',
    token: 'brand-purple',
    bgClass: 'bg-brand-purple',
    usage: 'Primary brand color',
  },
  { name: 'Pink', token: 'brand-pink', bgClass: 'bg-brand-pink', usage: 'Secondary brand color' },
  { name: 'White', token: 'white', bgClass: 'bg-white', usage: 'Brand color' },
  { name: 'Violet', token: 'brand-violet', bgClass: 'bg-brand-violet', usage: 'Brand color' },
  { name: 'Maroon', token: 'brand-maroon', bgClass: 'bg-brand-maroon', usage: 'Brand color' },
];

const BACKGROUND: Swatch[] = [
  { name: 'Page background', token: 'page', bgClass: 'bg-page', usage: 'Page' },
  {
    name: 'White background',
    token: 'white',
    bgClass: 'bg-white',
    usage: 'Top header, sidebars, popup body, alert body',
  },
  {
    name: 'Form filter background',
    token: 'form-filter',
    bgClass: 'bg-form-filter',
    usage: 'Form filter',
  },
  {
    name: 'Dashboard form filter',
    token: 'dashboard-filter',
    bgClass: 'bg-dashboard-filter',
    usage: 'Dashboard form filter',
  },
  {
    name: 'Modal popup form BG',
    token: 'modal-form',
    bgClass: 'bg-modal-form',
    usage: 'Modals containing forms — ⚠️ spec defect, see report (probable paste error)',
  },
];

const TEXT: Swatch[] = [
  {
    name: 'Primary text',
    token: 'ink-primary',
    bgClass: 'bg-ink-primary',
    usage: 'Main headings, title text, input labels',
  },
  {
    name: 'Secondary text',
    token: 'ink-secondary',
    bgClass: 'bg-ink-secondary',
    usage: 'Sub-headings, paragraph text',
  },
  {
    name: 'Blue label text',
    token: 'ink-blue-label',
    bgClass: 'bg-ink-blue-label',
    usage: 'Blue label text',
  },
];

const BORDER: Swatch[] = [
  {
    name: 'Border — form fields',
    token: 'line-field',
    bgClass: 'bg-line-field',
    usage: 'All form fields',
  },
  { name: 'Border — table', token: 'line-table', bgClass: 'bg-line-table', usage: 'Table' },
  {
    name: 'Button border',
    token: 'line-button',
    bgClass: 'bg-line-button',
    usage: 'Button border',
  },
  {
    name: 'Decorative border',
    token: 'line-decorative',
    bgClass: 'bg-line-decorative',
    usage: 'Separating sections',
  },
];

const ERROR: Swatch[] = [
  {
    name: 'Error fill',
    token: 'fill-error',
    bgClass: 'bg-fill-error',
    usage: '(inferred) form-field error background',
  },
  { name: 'Error text', token: 'ink-error', bgClass: 'bg-ink-error', usage: 'Error text' },
  {
    name: 'Error border',
    token: 'line-error',
    bgClass: 'bg-line-error',
    usage: 'Error border — ⚠️ identical to form/table border, see report',
  },
];

function ContrastBadge({ hex }: { hex: string }) {
  const onWhite = getContrastRatio(hex, '#FFFFFF');
  const textPasses = meetsTextContrast(hex, '#FFFFFF');
  const nonTextPasses = meetsNonTextContrast(hex, '#FFFFFF');
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-semibold ${
        textPasses
          ? 'bg-emerald-50 text-emerald-700'
          : nonTextPasses
            ? 'bg-amber-50 text-amber-800'
            : 'bg-red-50 text-red-700'
      }`}
    >
      {onWhite.toFixed(2)}:1 on white —{' '}
      {textPasses ? 'AA text pass' : nonTextPasses ? 'non-text only' : 'FAIL'}
    </span>
  );
}

function ColorSection({ title, swatches }: { title: string; swatches: Swatch[] }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-heading-3 font-semibold text-ink-primary">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {swatches.map((swatch) => {
          const hex = resolveToken(swatch.token);
          return (
            <div key={swatch.token} className="rounded-lg border border-line-decorative p-3">
              <div
                className={`mb-2 h-12 w-full rounded-lg border border-line-decorative ${swatch.bgClass}`}
              />
              <p className="text-body font-semibold text-ink-primary">{swatch.name}</p>
              <p className="text-caption text-ink-secondary">{hex.toUpperCase()}</p>
              <p className="text-caption text-ink-secondary">token: {swatch.token}</p>
              <p className="mb-2 text-caption text-ink-secondary">{swatch.usage}</p>
              <ContrastBadge hex={hex} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

const meta: Meta = {
  title: 'Design System/Colors',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const AllColors: Story = {
  render: () => (
    <div>
      <p className="mb-6 max-w-2xl text-body text-ink-secondary">
        Every swatch below is read live from <code>tailwind.config.js</code> — it cannot drift from
        what components actually use. The contrast badge is computed, not hand-typed, against WCAG
        2.1: green passes the 4.5:1 text minimum, amber only clears the 3:1 non-text minimum
        (borders/focus rings), red fails both. See the token migration report for the full defect
        list (the pink brand color and the form-field border are known failures).
      </p>
      <ColorSection title="Brand" swatches={BRAND} />
      <ColorSection title="Background" swatches={BACKGROUND} />
      <ColorSection title="Text" swatches={TEXT} />
      <ColorSection title="Border" swatches={BORDER} />
      <ColorSection title="Error" swatches={ERROR} />
    </div>
  ),
};
