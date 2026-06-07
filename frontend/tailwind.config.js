/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#3b82f6',
          500: '#1d6ff2',
          600: '#1a5fd4',
          700: '#0d47a1',
          800: '#0a3580',
          900: '#0a2463',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 4px 16px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 8px 30px rgba(29, 111, 242, 0.12), 0 2px 8px rgba(15, 23, 42, 0.06)',
        nav: '0 1px 0 rgba(15, 23, 42, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
  safelist: [
    'shadow-card',
    'shadow-card-hover',
    'text-brand-600',
    'bg-brand-600',
    'hover:bg-brand-600',
    'hover:text-brand-600',
    'hover:border-brand-200',
  ],
};
