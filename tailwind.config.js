/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#EEF4FF',
          100: '#C7D9FF',
          200: '#92B4FF',
          400: '#4D7FE8',
          600: '#2255C4',
          800: '#12348A',
          900: '#081D5C',
        },
        gold: {
          400: '#D4A843',
          600: '#A07830',
        }
      }
    },
  },
  plugins: [],
}
