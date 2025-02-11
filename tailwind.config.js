/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        main: "linear-gradient(to right,rgb(249, 246, 245), #ffff)",
        redToOrange: "linear-gradient(to right,rgb(252, 84, 58),rgb(255, 123, 28))",
      }
    },
  },
  plugins: [],
}

