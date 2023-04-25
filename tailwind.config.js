/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a4ffad",
        secondary: "#f8ce63",
        dark: "#141219",
        "dark-lighter": "#25222b",
      },
    },
  },
  plugins: [],
};
