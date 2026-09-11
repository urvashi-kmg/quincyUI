import type { Meta, StoryObj } from '@storybook/react';

/**
 * Every row below is rendered with the actual `text-*` utility classes from
 * tailwind.config.js's fontSize scale (Typography.pdf 2.6) — not
 * hand-copied pixel values — so this page can't drift from what components
 * use. Line-heights use the Figma pixel column; it disagrees with the ratio
 * column for Heading 1 and Heading 6 (see the token migration report's
 * reconciliation table), and the Figma pixel value was designated
 * authoritative. No font-weight is specified for any heading in the spec
 * (only Root/Body states weight 500) — each row below shows the class
 * without forcing a weight, and callers choose one contextually.
 */
interface TypeRow {
  label: string;
  className: string;
  size: string;
  lineHeight: string;
  note?: string;
}

const ROWS: TypeRow[] = [
  { label: 'Caption', className: 'text-caption', size: '12px', lineHeight: '16px' },
  { label: 'Small', className: 'text-small', size: '14px', lineHeight: '20px' },
  { label: 'Body', className: 'text-body', size: '16px', lineHeight: '24px' },
  {
    label: 'Heading 1',
    className: 'text-heading-1',
    size: '18px',
    lineHeight: '26px',
    note: '⚠️ ratio (1.4) implies 25.2px, not 26px — Figma px used, see report',
  },
  { label: 'Heading 2', className: 'text-heading-2', size: '20px', lineHeight: '28px' },
  { label: 'Heading 3', className: 'text-heading-3', size: '24px', lineHeight: '32px' },
  { label: 'Heading 4', className: 'text-heading-4', size: '28px', lineHeight: '36px' },
  { label: 'Heading 5', className: 'text-heading-5', size: '32px', lineHeight: '40px' },
  {
    label: 'Heading 6',
    className: 'text-heading-6',
    size: '48px',
    lineHeight: '56px',
    note: '⚠️ ratio (1.33) implies 63.84px, not 56px — Figma px used, see report',
  },
];

const SAMPLE = 'Text Sample with Line height';
const LONG_SAMPLE =
  'Text Sample with Line height, and considerably more of it, so we can see how this style wraps across several lines when the content is long rather than a single short phrase.';

function TypeSpecimen({ row, sample }: { row: TypeRow; sample: string }) {
  return (
    <div className="mb-6 border-b border-line-decorative pb-6 last:border-b-0">
      <div className="mb-2 flex flex-wrap items-baseline gap-3 text-caption text-ink-secondary">
        <span className="font-semibold text-ink-primary">{row.label}</span>
        <span>class: {row.className}</span>
        <span>
          {row.size} / {row.lineHeight}
        </span>
        {row.note && <span className="text-ink-error">{row.note}</span>}
      </div>
      <p className={`${row.className} text-ink-primary`}>{sample}</p>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const AllStyles: Story = {
  render: () => (
    <div className="max-w-3xl">
      <p className="mb-6 text-body text-ink-secondary">
        Font: Inter (self-hosted, see index.css). Root text is 16px/1.5, weight 500, color
        ink-primary (Typography.pdf &quot;Root Text&quot;).
      </p>
      {ROWS.map((row) => (
        <TypeSpecimen key={row.className} row={row} sample={SAMPLE} />
      ))}
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div className="max-w-3xl">
      {ROWS.map((row) => (
        <TypeSpecimen key={row.className} row={row} sample={LONG_SAMPLE} />
      ))}
    </div>
  ),
};

export const NarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <div className="w-[320px]">
      {ROWS.map((row) => (
        <TypeSpecimen key={row.className} row={row} sample={LONG_SAMPLE} />
      ))}
    </div>
  ),
};
