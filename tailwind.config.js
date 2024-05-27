/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      // added translate-1/8 to tailwindcss styles
      translate: {
        '1/8': '12.5%',
      }
    },
  },
  plugins: [],
}

