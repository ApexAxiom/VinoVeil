module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#121010",
        cocoa: "#1d1917",
        gold: "#d4af37",
        wine: "#6f1d28",
        parchment: "#f5e8d3"
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 8px 30px rgba(212, 175, 55, 0.25)"
      }
    }
  },
  plugins: []
};
