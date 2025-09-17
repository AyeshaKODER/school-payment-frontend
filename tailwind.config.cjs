/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",   // blue
        secondary: "#f59e0b", // amber
        accent: "#10b981",    // emerald
        danger: "#ef4444",    // red
        success: "#22c55e",   // green
        background: "#f9fafb", 
        card: "#ffffff",
        foreground: "#1f2937",  // <-- added properly
      },
    },
  },
  plugins: [],
};
