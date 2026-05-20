/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'liturgical-blue': '#1A237E',
        'gold': '#D4AF37',
        'parchment': '#F8F4E3',
        'text': '#1B1B1B',
        'text-secondary': '#666',
        'success': '#2E7D32',
        'warning': '#F57F17',
        'error': '#C62828',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'noto-ethiopic': ['Noto Serif Ethiopic', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/src/assets/backgroundImage.jpg')", 
      },
    },
  },
  plugins: [],
};