import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1F2340',
        cream: '#FFF9EC',
        sun: '#FFC93C',
        sky: '#4CC9F0',
        mint: '#3DDBB0',
        coral: '#FF6B6B',
        grape: '#9B7BFF',
        bubble: '#FF8FB8',
      },
      fontFamily: {
        display: ['var(--font-fredoka)', 'ui-rounded', 'system-ui', 'sans-serif'],
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pop: '4px 4px 0 0 #1F2340',
        'pop-sm': '2px 2px 0 0 #1F2340',
        soft: '0 14px 30px -14px rgba(31,35,64,.4)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(var(--r, 0deg))' },
          '50%': { transform: 'translateY(-10px) rotate(var(--r, 0deg))' },
        },
        pop: {
          '0%': { transform: 'scale(.4)', opacity: '0' },
          '60%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flash: {
          '0%': { opacity: '.95' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pop: 'pop .4s ease-out',
        flash: 'flash .45s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
