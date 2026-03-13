import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        soil: "#4F463E",
        moss: "#67795B",
        sage: "#A8B49B",
        cream: "#F6F1E7",
        petal: "#E9DED0",
        bark: "#2F2A24"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(47, 42, 36, 0.08)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
