const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    'src/pages/**/*.{js,ts,jsx,tsx}',
    'src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        downy: {
          DEFAULT: '#71C9CE',
          50: '#F9FDFD',
          100: '#EAF7F8',
          200: '#CCECED',
          300: '#AEE0E3',
          400: '#8FD5D8',
          500: '#71C9CE',
          600: '#47B9C0',
          650: '#3CA9B0',
          700: '#35949A',
          800: '#276C70',
          900: '#184446',
        },
      },
    },
  },
  plugins: [],
};
