/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      'blue': '#002add',
      'dark-blue': '#1e2d52',
      'black': '#151c2b',
      'white': '#fff',
    },
    extend: {},
  },
  plugins: [],
}
