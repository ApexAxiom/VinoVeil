module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#050403",
        espresso: "#1c1007",
        cocoa: "#2b1b0e",
        wine: "#3a0c10",
        burgundy: "#4a0d16",
        gold: "#c9a66b",
        ivory: "#f9f1e3",
        parchment: "#f5e8d3",
        amber: "#8b6e4f",
        charcoal: "#2a2420"
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(201, 166, 107, 0.35)",
        card: "0 24px 60px rgba(5, 4, 3, 0.35)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem"
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: []
};
