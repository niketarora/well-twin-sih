/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F4F6F8',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F9FA',
          subtle: '#EDF0F3',
        },
        border: {
          DEFAULT: '#E2E6EA',
          subtle: '#EDF0F3',
          hover: '#D1D7DC',
          dark: '#B6BDC5',
        },
        petroleum: {
          DEFAULT: '#C69A45',
          deep: '#8A6A22',
          hover: '#B58B3A',
          active: '#9E772E',
          tint: 'rgba(198, 154, 69, 0.08)',
          'tint-strong': 'rgba(198, 154, 69, 0.15)',
        },
        ink: {
          DEFAULT: '#17212B',
          secondary: '#66717C',
          muted: '#8B949E',
        },
        status: {
          green: '#3FA66B',
          'green-deep': '#2E8A56',
          'green-bg': 'rgba(63, 166, 107, 0.08)',
          warn: '#D49A3A',
          'warn-deep': '#A5741F',
          'warn-bg': 'rgba(212, 154, 58, 0.10)',
          crit: '#D95C5C',
          'crit-deep': '#B34747',
          'crit-bg': 'rgba(217, 92, 92, 0.08)',
          info: '#4F8FC4',
          'info-deep': '#3B7BAB',
          'info-bg': 'rgba(79, 143, 196, 0.10)',
        },
      },
      fontFamily: {
        heading: ['"IBM Plex Sans"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(23, 33, 43, 0.04), 0 1px 2px rgba(23, 33, 43, 0.02)',
        card: '0 2px 4px rgba(23, 33, 43, 0.04), 0 1px 2px rgba(23, 33, 43, 0.02)',
        flyout: '0 8px 24px rgba(23, 33, 43, 0.08), 0 2px 6px rgba(198, 154, 69, 0.06)',
      },
    },
  },
  plugins: [],
};
