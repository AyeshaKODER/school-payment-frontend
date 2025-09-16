// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9fafb",   // or your preferred background color
        foreground: "#111827",   // or your preferred text color
      },
    },
  },
  plugins: [],
};