/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#0066CC",
        "primary-light": "#4D94FF",
        success: "#00AA00",
        warning: "#FF6600",
        danger: "#CC0000",
        "background-primary": "#FFFFFF",
        "background-secondary": "#F5F5F5",
        "border-default": "#CCCCCC",
        "border-light": "#E8E8E8",
        "text-primary": "#000000",
        "text-secondary": "#666666",
        "text-disabled": "#AAAAAA",
        "surface-hover": "#F0F0F0",
      },
      fontSize: {
        body: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["12px", { lineHeight: "1.4", fontWeight: "400" }],
        label: ["12px", { lineHeight: "1.4", fontWeight: "600" }],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
      fontFamily: {
        mono: ["Courier New", "monospace"],
      },
    },
  },
  plugins: [],
}

