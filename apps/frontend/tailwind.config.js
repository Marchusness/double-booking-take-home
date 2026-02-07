/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fb923c", // Orange-400 equivalent
        "primary-hover": "#f97316", // Orange-500
        background: "#ffffff",
        divider: "#f3f4f6", // Gray-100
        "text-primary": "#111827", // Gray-900
        "text-secondary": "#6b7280", // Gray-500
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
