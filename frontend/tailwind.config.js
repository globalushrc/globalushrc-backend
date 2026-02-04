/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#0F172A", // Navy Blue / Slate 900
        secondary: "#334155", // Charcoal / Slate 700
        accent: "#3B82F6", // Blue 500
      },
    },
  },
  plugins: [],
};
