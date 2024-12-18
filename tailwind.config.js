const { nextui } = require('@nextui-org/react')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'],
        sourGummy: ['"Sour Gummy"', 'sans-serif'],
        wallpoet: ['"Wallpoet"', 'sans-serif']
      },
      colors: {
        buttonPrimary: '#B6D8FF',
        buttonSecondary: '#D4EDFF',
        backgroundWhite: '#FBFBFB'
      }
    }
  },
  darkMode: 'class',
  plugins: [nextui()]
}
