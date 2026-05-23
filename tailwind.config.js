/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "'Inter'",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Noto Sans TC'",
          "'PingFang TC'",
          "'Microsoft JhengHei'",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcdcff",
          300: "#8ec6ff",
          400: "#599fff",
          500: "#3375ff",
          600: "#1f57f0",
          700: "#1c44d0",
          800: "#1d39a5",
          900: "#1d3580",
        },
      },
    },
  },
  plugins: [],
};
