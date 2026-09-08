import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "var(--font-plus-jakarta-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        "plus-jakarta-sans": ["'Plus Jakarta Sans'", "var(--font-plus-jakarta-sans)", "sans-serif"],
        poppins: ["'Plus Jakarta Sans'", "var(--font-plus-jakarta-sans)", "sans-serif"],
        serif: ["'Merriweather'", "Georgia", "Cambria", "'Times New Roman'", "serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        inter: ["'Inter'", "sans-serif"],
        playfair: ["'Playfair Display'", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": ["clamp(0.625rem, 0.58rem + 0.15vw, 0.6875rem)", { lineHeight: "0.95rem", letterSpacing: "0.005em" }],
        xs: ["clamp(0.6875rem, 0.64rem + 0.2vw, 0.75rem)", { lineHeight: "1.15rem", letterSpacing: "-0.005em" }],
        sm: ["clamp(0.8125rem, 0.76rem + 0.25vw, 0.875rem)", { lineHeight: "1.35rem", letterSpacing: "-0.008em" }],
        base: ["clamp(0.875rem, 0.82rem + 0.3vw, 1rem)", { lineHeight: "1.55rem", letterSpacing: "-0.011em" }],
        lg: ["clamp(1rem, 0.92rem + 0.4vw, 1.125rem)", { lineHeight: "1.7rem", letterSpacing: "-0.015em" }],
        xl: ["clamp(1.125rem, 1.02rem + 0.52vw, 1.25rem)", { lineHeight: "1.8rem", letterSpacing: "-0.018em" }],
        "2xl": ["clamp(1.25rem, 1.12rem + 0.7vw, 1.5rem)", { lineHeight: "2rem", letterSpacing: "-0.022em" }],
        "3xl": ["clamp(1.5rem, 1.32rem + 0.95vw, 1.875rem)", { lineHeight: "2.3rem", letterSpacing: "-0.026em" }],
        "4xl": ["clamp(1.875rem, 1.62rem + 1.3vw, 2.25rem)", { lineHeight: "2.65rem", letterSpacing: "-0.03em" }],
        "5xl": ["clamp(2.25rem, 1.9rem + 1.8vw, 3rem)", { lineHeight: "1.15", letterSpacing: "-0.035em" }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        medical: {
          blue: "#0A2540",
          teal: "#0D9488",
          cyan: "#06B6D4",
          amber: "#D97706",
          emerald: "#059669",
          slate: "#1E293B",
        }
      },
      borderRadius: {
        "3xl": "1.5rem",
        "2xl": "1rem",
        xl: "0.75rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "2xs": "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};

export default config;
