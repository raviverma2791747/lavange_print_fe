/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        figtree: ["Figtree", ...defaultTheme.fontFamily.sans],
        poppins: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          50: "#fff1f1",
          100: "#ffe1e1",
          200: "#ffc8c8",
          300: "#ffa1a1",
          400: "#fe5b5b",
          500: "#f73c3c",
          600: "#e41e1e",
          700: "#c01515",
          800: "#9f1515",
          900: "#831919",
          950: "#480707",
        },
        transparent: "transparent",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
