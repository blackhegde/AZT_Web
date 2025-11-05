// @type {import('tailwindcss').Config}
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./@/**/*.{js,jsx,ts,tsx}", 
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          // Core colors
          border: 'hsl(214.3 31.8% 91.4%)',
          background: '#ffffff',
          foreground: '#111827',
          
          // Card colors
          card: {
            DEFAULT: '#ffffff',
            foreground: '#111827',
          },
          
          // Popover colors
          popover: {
            DEFAULT: '#ffffff',
            foreground: '#111827',
          },
          
          // Primary colors
          primary: {
            DEFAULT: '#111827', // ~oklch(0.205 0 0)
            foreground: '#fafafa', // ~oklch(0.985 0 0)
          },
          
          // Secondary colors
          secondary: {
            DEFAULT: '#f7f7f7', // ~oklch(0.97 0 0)
            foreground: '#111827',
          },
          
          // Muted colors
          muted: {
            DEFAULT: '#f7f7f7',
            foreground: '#6b7280', // ~oklch(0.556 0 0)
          },
          
          // Accent colors
          accent: {
            DEFAULT: '#f7f7f7',
            foreground: '#111827',
          },
          
          // Destructive colors
          destructive: {
            DEFAULT: '#dc2626', // ~oklch(0.577 0.245 27.325) converted to hex
            foreground: '#ffffff',
          },
          
          // Input colors
          input: 'hsl(214.3 31.8% 91.4%)',
          
          // Ring colors
          ring: '#6b7280', // ~oklch(0.708 0 0)
        },
        borderRadius: {
          lg: '0.625rem', // 10px
          md: 'calc(0.625rem - 2px)',
          sm: 'calc(0.625rem - 4px)',
        },
      },
    },
    plugins: [],
  }