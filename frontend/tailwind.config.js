/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: 'var(--canvas)',
          subtle: 'var(--canvas-subtle)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          secondary: 'var(--surface-secondary)',
          elevated: 'var(--surface-elevated)',
          hover: 'var(--surface-hover)',
        },
        border: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border-subtle)',
          hover: 'var(--border-hover)',
          dark: 'var(--border-dark)',
        },
        petroleum: {
          DEFAULT: 'var(--petroleum)',
          deep: 'var(--petroleum-deep)',
          hover: 'var(--petroleum-hover)',
          active: 'var(--petroleum-active)',
          tint: 'var(--petroleum-tint)',
          'tint-strong': 'var(--petroleum-tint-strong)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          secondary: 'var(--ink-secondary)',
          muted: 'var(--ink-muted)',
        },
        status: {
          green: 'var(--status-green)',
          'green-deep': 'var(--status-green-deep)',
          'green-bg': 'var(--status-green-bg)',
          warn: 'var(--status-warn)',
          'warn-deep': 'var(--status-warn-deep)',
          'warn-bg': 'var(--status-warn-bg)',
          crit: 'var(--status-crit)',
          'crit-deep': 'var(--status-crit-deep)',
          'crit-bg': 'var(--status-crit-bg)',
          info: 'var(--status-info)',
          'info-deep': 'var(--status-info-deep)',
          'info-bg': 'var(--status-info-bg)',
        },
      },
      fontFamily: {
        heading: ['"IBM Plex Sans"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        card: 'var(--shadow-card)',
        flyout: 'var(--shadow-flyout)',
      },
    },
  },
  plugins: [],
};
