/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        earth: {
          50: '#f7f2e7',
          100: '#ebdfc7',
          500: '#8a6a3f',
          700: '#5f4728',
          900: '#2c2114',
        },
        leaf: {
          100: '#dce7c7',
          500: '#5c8a3d',
          700: '#3e6128',
        },
        sky: {
          100: '#d6edf3',
          500: '#4a90a4',
          700: '#2d5f6d',
        },
      },
      boxShadow: {
        card: '0 14px 40px rgba(44, 33, 20, 0.12)',
      },
    },
  },
  plugins: [],
};
