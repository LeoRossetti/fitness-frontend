import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        main: {
          DEFAULT: '#7c3aed',
          light: '#dacdf0',
          dark: '#5b21b6',
        },
        background: {
          white: '#FFFFFF',
          light: '#F3F4F6',
        },
        primary: '#1F2A44',
        secondary: '#6B7280',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};

export default config;