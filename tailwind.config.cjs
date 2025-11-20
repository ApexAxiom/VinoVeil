module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#050403",
        espresso: "#1c1007",
        cocoa: "#2b1b0e",
        wine: "#3a0c10",
        gold: "#c9a66b",
        parchment: "#f5e8d3",
        amber: "#8b6e4f"
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(201, 166, 107, 0.35)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
};
