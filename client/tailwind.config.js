/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#12372A',
          deep: '#0B221A',
          light: '#1B4D3C',
        },
        moss: {
          DEFAULT: '#4F6F52',
          light: '#698E6C',
          faint: '#DDE5DC',
        },
        paper: {
          DEFAULT: '#F7F4EC',
          bright: '#FDFBF7',
          deep: '#EFEADB',
          dark: '#E2DBD0',
        },
        stone: {
          DEFAULT: '#E7E0D3',
          light: '#F0ECE4',
          deep: '#CEC5B5',
        },
        terracotta: {
          DEFAULT: '#C96B4B',
          light: '#DE8466',
          deep: '#A35034',
        },
        ink: {
          DEFAULT: '#17201B',
          muted: '#4B5850',
          faint: '#859189',
          border: 'rgba(23, 32, 27, 0.08)',
        },
        field: {
          bg: '#0E1712',
          paper: '#132019',
          border: '#1C2E24',
          text: '#C8D3CA',
          muted: '#6E8275',
          accent: '#E58A6A',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'journal-subtle': '0 2px 10px rgba(23, 32, 27, 0.04), 0 1px 2px rgba(23, 32, 27, 0.02)',
        'journal-card': '0 4px 20px rgba(23, 32, 27, 0.06), 0 1px 3px rgba(23, 32, 27, 0.03)',
        'journal-raised': '0 12px 36px rgba(23, 32, 27, 0.08), 0 2px 6px rgba(23, 32, 27, 0.04)',
      },
      transitionTimingFunction: {
        'field-settle': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'journal-turn': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'fade-out-slow': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '800': '800ms',
        '1200': '1200ms',
      },
    },
  },
  plugins: [],
}
