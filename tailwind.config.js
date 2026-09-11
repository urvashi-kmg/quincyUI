/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Custom Quincy-UI theme tokens, sourced from the design system spec
      // (Colors.pdf, Typography.pdf, Buttons.pdf, Form Fields.pdf). Components
      // must consume these tokens rather than raw hex literals or Tailwind's
      // default color/type scale — see .claude/rules/styling.md.
      //
      // Deliberately NOT tokenized here (kept out of scope — spec doesn't
      // cover them): the status-badge palette (QuoteStatusBadge), the
      // PremiumTrendChart line color, `muted.light` (generic hover tint),
      // `borderRadius.card` (button/popup radius), `fontFamily.mono`, and the
      // Popup's shadow/backdrop-opacity. See the token migration report for
      // the full "no spec equivalent" list and rationale.
      colors: {
        // `surface.light` (the old #ffffff token) is deleted rather than kept
        // dead — every consumer now uses Tailwind's stock `white`, which is
        // the same value, or the new `page`/`modal-form` background tokens.
        muted: {
          light: '#f4f6fb',
        },
        // Button variant colors (Buttons.pdf 2.8). Named by role, not a tint
        // ramp — the spec gives discrete state colors, not a numeric scale.
        // Prefixed `brand-` because Tailwind already ships default `purple`,
        // `pink` and `violet` scales — reusing those bare names would shadow
        // (or unpredictably deep-merge with) the built-in palette and defeat
        // "one source of truth".
        'brand-purple': {
          DEFAULT: '#7B209E',
          hover: '#540F75',
          active: '#860DB4',
        },
        'brand-pink': {
          DEFAULT: '#FF387B',
          hover: '#DA215F',
          active: '#BE0040',
          // Spec-defect: disabled fill is an off-brand purple (671C84), not a
          // tint of FF387B like every other pink state. Implemented literally
          // and flagged — see the report.
          disabled: '#671C84',
        },
        // Brand identity colors (Colors.pdf 2.1) beyond purple/pink.
        'brand-violet': '#6938AA',
        'brand-maroon': '#A41C42',
        // Gradient-button-only state with no reusable name elsewhere.
        'gradient-button': {
          hover: '#AA2891',
        },
        // Outlined-secondary-only states with no reusable name elsewhere.
        'outlined-secondary': {
          active: '#F8F1FF',
          loading: '#671C84',
        },
        // Backgrounds (Colors.pdf 2.2). A `white` background token is
        // intentionally omitted — Tailwind's stock `white` (#ffffff) already
        // covers it; adding one would duplicate an existing value.
        page: '#F1F1FF',
        'form-filter': '#E9F0FF',
        'dashboard-filter': '#E7E7FF',
        // Spec-defect: dark green, unlike every other near-white background
        // in this section — almost certainly a paste error. Implemented
        // literally per explicit instruction; flagged in the report.
        'modal-form': '#006644',
        // Text (Colors.pdf 2.3 + Error Color's "Error Text"). Namespaced
        // `ink-*` rather than `text-*` so the family name doesn't collide
        // with the `text-` utility prefix itself (avoids `text-text-primary`).
        'ink-primary': '#1C1B1F',
        'ink-secondary': '#404B5B',
        'ink-blue-label': '#193CB8',
        'ink-error': '#AB204F',
        // Form Fields.pdf 2.9's placeholder color.
        'ink-placeholder': '#595959',
        // Borders (Colors.pdf 2.4 + 2.5). Namespaced `line-*` for the same
        // reason (avoids `border-border-field`).
        'line-field': '#8F8F8F',
        'line-table': '#8F8F8F',
        // Spec-defect: identical to `line-field`/`line-table`, making error
        // fields visually indistinguishable from default ones. Implemented
        // literally per explicit instruction; flagged in the report.
        'line-error': '#8F8F8F',
        'line-button': '#82859E',
        'line-decorative': '#C2CDDE',
        // Given as "Border Color-Table" in the Error Color section of
        // Colors.pdf, but visually matches the pink-tinted error fill shown
        // in Form Fields.pdf's Error Input state — used here as the
        // form-field error background. This is an inference from a
        // mislabeled-but-given hex, not an invented value; flagged in the
        // report for design confirmation. Namespaced for symmetry with future
        // fill-success/fill-disabled once design supplies them.
        'fill-error': '#FFEAEF',
      },
      // Brand/decorative gradient (Colors.pdf 2.1) — distinct from the button
      // gradient's stops. The button gradient's third stop (6938AA) differs
      // from the brand gradient's (5E1BA6) — a spec inconsistency, both are
      // implemented in their own context and flagged in the report.
      backgroundImage: {
        'gradient-brand': 'linear-gradient(90deg, #FF387B 0%, #AE2A90 50%, #5E1BA6 100%)',
        'gradient-button': 'linear-gradient(90deg, #FF387B 0%, #AE2A90 50%, #6938AA 100%)',
        'gradient-button-active': 'linear-gradient(90deg, #BE0040 0%, #8B1671 50%, #540F75 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      // Typography scale (Typography.pdf 2.6). Line-heights use the Figma
      // pixel column, not the CSS ratio column — they disagree for Heading 1
      // and Heading 6 (see the report's reconciliation table); the Figma
      // pixel value was designated authoritative. Font-weight is deliberately
      // omitted from every heading entry — the spec's type table has no
      // weight column for headings (only Root/Body states weight 500), so
      // weight is left to the caller rather than guessed.
      fontSize: {
        caption: ['12px', { lineHeight: '16px' }],
        small: ['14px', { lineHeight: '20px' }],
        body: ['16px', { lineHeight: '24px' }],
        'heading-1': ['18px', { lineHeight: '26px' }],
        'heading-2': ['20px', { lineHeight: '28px' }],
        'heading-3': ['24px', { lineHeight: '32px' }],
        'heading-4': ['28px', { lineHeight: '36px' }],
        'heading-5': ['32px', { lineHeight: '40px' }],
        'heading-6': ['48px', { lineHeight: '56px' }],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
};
