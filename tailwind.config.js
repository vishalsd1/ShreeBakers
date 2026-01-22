/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F3',
        peach: '#F4A084',
        coral: '#FF6B6B',
        chocolate: '#8B4513',
        gold: '#D4AF37',
      },
    },
  },
  plugins: [],
}
