/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Afristore brand palette — warm earth tones inspired by African art.
        brand: {
          50:  "#fdf6ee",
          100: "#faecd9",
          200: "#f4d5ae",
          300: "#ecb878",
          400: "#e49440",
          500: "#de7a1e",   // primary orange
          600: "#cf6015",
          700: "#ac4914",
          800: "#8a3a17",
          900: "#713116",
          950: "#3d1608",
        },
        earth: {
          light: "#c9a96e",
          DEFAULT: "#8b6914",
          dark: "#4b3510",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
