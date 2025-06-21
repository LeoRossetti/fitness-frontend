import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
          DEFAULT: '#7c3aed', // фиолетовый - основной брендинговый цвет
          dark: '#5b21b6',
        },
        background: {
          light: '#F3F4F6',
        },
        primary: '#1F2A44',    // темно-синий - для заголовков
        secondary: '#6B7280',  // серый - для описаний
        // Добавляем цвета для замены хардкода
        accent: '#8B5CF6',     // вместо bg-[#8B5CF6] - для активных элементов
        success: '#10B981',    // вместо bg-[#10B981] - для успешных действий
        danger: '#EF4444',     // вместо text-[#EF4444] - для ошибок/удаления
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
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};

export default config;