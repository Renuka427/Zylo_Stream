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
          border: '#E5D4B8',
        },
        ivory: {
          DEFAULT: '#FFFAF2',
          surface: '#FFFDF9',
        },
        cherry: {
          DEFAULT: '#C41E3A',
          hover: '#A91730',
          dark: '#791D32',
          darker: '#5E1425',
          light: '#FCECEF',
        },
        espresso: {
          DEFAULT: '#292321',
          light: '#423A37',
          muted: '#82766F',
        },
        stone: {
          warm: '#E5D4B8',
          subtle: '#EDE2D0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'luxury': '0 4px 20px -2px rgba(41, 35, 33, 0.06), 0 2px 6px -1px rgba(41, 35, 33, 0.04)',
        'luxury-lg': '0 12px 30px -4px rgba(41, 35, 33, 0.08), 0 4px 12px -2px rgba(41, 35, 33, 0.04)',
        'card': '0 2px 8px 0 rgba(41, 35, 33, 0.04)',
        'elevated': '0 16px 32px -4px rgba(121, 29, 50, 0.12), 0 6px 12px -2px rgba(41, 35, 33, 0.06)',
      },
    },
  },
  plugins: [],
}
