/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        champagne: {
          DEFAULT: '#F5E9D5',
          light: '#FAF3E8',
          gold: '#D6B779',
        },
        ivory: {
          DEFAULT: '#FFFAF2',
        },
        cherry: {
          DEFAULT: '#C41E3A',
          dark: '#791D32',
        },
        espresso: {
          DEFAULT: '#292321',
        },
        stone: {
          warm: '#E5D4B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
