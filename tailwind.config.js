/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Custom Quincy-UI theme tokens. Components must consume these tokens
      // (bg-surface, text-primary, etc.) rather than raw Tailwind palette
      // classes or hex literals — see .claude/rules/styling.md.
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b3ccff',
          300: '#82abff',
          400: '#4d82ff',
          500: '#2158f5',
          600: '#1642c2',
          700: '#123399',
          800: '#0f2870',
          900: '#0b1c4d',
        },
        surface: {
          light: '#ffffff',
        },
        muted: {
          light: '#f4f6fb',
        },
        border: {
          light: '#e2e5ec',
        },
      },
      fontFamily: {
        sans: ['"Inter var"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
};
