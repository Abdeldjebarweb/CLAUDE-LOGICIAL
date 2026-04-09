/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vert: {
          50: '#eefbf0',
          100: '#d6f5db',
          200: '#b0eabc',
          300: '#7dd993',
          400: '#4ec26a',
          500: '#006233',
          600: '#005a2e',
          700: '#004d27',
          800: '#003d1f',
          900: '#002d16',
          DEFAULT: '#006233',
        },
        rouge: {
          50: '#fff1f1',
          100: '#ffe0e0',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6b6b',
          500: '#D21034',
          600: '#bf0e2e',
          700: '#a10c27',
          800: '#860a20',
          900: '#6e0819',
          DEFAULT: '#D21034',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
