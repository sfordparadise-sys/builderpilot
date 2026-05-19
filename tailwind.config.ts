import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // BuilderPilot brand palette
        ink: {
          DEFAULT: '#121212',  // matte black - primary surfaces
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#c9c9c9',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#3d3d3d',
          700: '#2a2a2a',
          800: '#1e1e1e',   // dark charcoal
          900: '#121212',   // matte black
          950: '#0a0a0a',
        },
        gold: {
          DEFAULT: '#F5B400', // construction gold - primary accent
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F5B400',   // brand gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        concrete: {
          DEFAULT: '#8A8A8A',  // concrete gray
          light: '#a8a8a8',
          dark: '#6b6b6b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'tool': '0 1px 2px 0 rgb(0 0 0 / 0.4), 0 1px 3px 0 rgb(0 0 0 / 0.2)',
        'tool-lg': '0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
