// tailwind.config.js
module.exports = {
  darkMode: "class", // keep optional toggle
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",   // blue-500
        secondary: "#f59e0b", // amber-500
        accent: "#10b981",    // emerald-500
        danger: "#ef4444",    // red-500
        success: "#22c55e",   // green-500
        background: "#f9fafb", // light gray
        card: "#ffffff",      // white cards
        text: "#1f2937",      // slate-800
      },
    },
  },
  plugins: [],
};
