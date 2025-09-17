// tailwind.config.js
module.exports = {
  darkMode: "class", // enables dark mode via class="dark"
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6", // blue-500
          dark: "#1d4ed8",    // blue-700
          light: "#93c5fd",   // blue-300
        },
        secondary: {
          DEFAULT: "#f59e0b", // amber-500
          dark: "#b45309",    // amber-700
          light: "#fcd34d",   // amber-300
        },
        accent: {
          DEFAULT: "#10b981", // emerald-500
          dark: "#047857",    // emerald-700
          light: "#6ee7b7",   // emerald-300
        },
        success: "#22c55e",  // green-500
        danger: "#ef4444",   // red-500
        warning: "#facc15",  // yellow-400
        background: "#f9fafb", // gray-50
        card: "#ffffff",     // white cards
        text: "#1f2937",     // slate-800
      },
      backgroundImage: {
        "gradient-rainbow": "linear-gradient(to right, #3b82f6, #f59e0b, #10b981, #ef4444, #8b5cf6)",
        "gradient-primary": "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        "gradient-accent": "linear-gradient(135deg, #10b981, #047857)",
      },
    },
  },
  plugins: [],
};
