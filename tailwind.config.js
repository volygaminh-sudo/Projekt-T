/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index/**/*.{html,js}",
    "!./index/tailwind.css",
    "./server/*.js",
  ],

  theme: {
    extend: {},
  },
  plugins: [],
}
