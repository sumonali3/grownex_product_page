/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Your content paths here, e.g.,
    "./index.html",
    "./single-product.html",
    //"./src//*.{js,ts,jsx,tsx}",
    './js/**/*.js',
    './css/**/*.css'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-teal': '#14B8A6',
        'brand-teal-dark': '#0D9488',
        'brand-dark': '#1F2937',
        'brand-text-medium': '#4B5563',
        'brand-text-light': '#6B7281',
        'brand-bg-light': '#F9FAFB',
        'brand-bg-white': '#FFFFFF',
        'brand-border': '#D1D5DB',
      }
    }
  },
  plugins: [],
}