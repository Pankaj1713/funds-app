/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#CC5500",
        borderColor: "#CC5500",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none",
        },
        ".scrollbar-hide": {
          "scrollbar-width": "none",
          "-ms-overflow-style": "none",
        },
      });
    },
  ],
};
