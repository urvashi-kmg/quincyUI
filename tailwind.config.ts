import type { Config } from 'tailwindcss';

// Quincy UI theme tokens.
// Palette is intentionally a deep marine/navy + a single warm signal amber —
// chosen for an insurance product (trust, stability, legibility for dense
// data tables) rather than the generic indigo/purple SaaS default.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4fb',
          100: '#d6e6f5',
          200: '#adccec',
          300: '#7cabdd',
          400: '#4c86c9',
          500: '#2c66ad',
          600: '#1f4e8c',
          700: '#1a3f70', // primary brand
          800: '#173459',
          900: '#152c49',
          950: '#0c1930',
        },
        signal: {
          // used sparingly: renewal warnings, badges, CTA accents
          amber: '#c8791f',
          red: '#b3261e',
          green: '#1e7a4c',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f6f8fb',
          dark: '#0f1621',
          'dark-subtle': '#161f2e',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 22 33 / 0.06), 0 1px 1px 0 rgb(15 22 33 / 0.04)',
      },
    },
  },
  plugins: [],
} satisfies Config;
