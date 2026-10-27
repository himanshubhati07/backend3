/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{svelte,js,ts}"],
  theme: {
    extend: {
      colors: {
        // Light theme palette
        primary: '#3B82F6',      // Bright blue
        secondary: '#0EA5E9',    // Cyan
        accent: '#06B6D4',       // Teal accent
        // Theme-aware tokens: values come from CSS variables in app.css (:root / .dark)
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        textSecondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        textMuted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        darkBackground: '#1a1a1a',
        lightBackground: '#ffffff',
        darkText: '#ffffff',
        lightText: '#000000',
        toggleAccent: '#007bff',
        success: '#10B981',      // Green
        warning: '#F59E0B',      // Amber
        danger: '#EF4444',       // Red
        info: '#3B82F6',         // Blue
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', '1rem'],
        sm: ['0.875rem', '1.25rem'],
        base: ['1rem', '1.5rem'],
        lg: ['1.125rem', '1.75rem'],
        xl: ['1.25rem', '1.75rem'],
        '2xl': ['1.5rem', '2rem'],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      spacing: {
        sidebar: '240px',
        topbar: '64px',
      },
    },
  },
  plugins: [],
}

