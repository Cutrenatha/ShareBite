/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#EA9D5C',
          secondary: '#F2AC69',
          accent: '#D4823C',
          light: '#FDF0E6',
          warm: '#FCEEE8',
          cream: '#FFFAF6',
          dark: '#4A3622',
          muted: '#CA9D6F',
        }
      },
      fontFamily: {
        display: ['"Segoe UI"', '"Roboto"', 'sans-serif'],
        heading: ['"Segoe UI"', '"Roboto"', 'sans-serif'],
        body: ['"Segoe UI"', '"Roboto"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'sans-serif'],
      },
      letterSpacing: {
        wide2: '0.08em',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(16px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
      },
      boxShadow: {
        warm: '0 4px 24px -4px rgba(234,157,92,0.15)',
        'warm-lg': '0 8px 40px -8px rgba(234,157,92,0.22)',
        card: '0 2px 12px rgba(74,54,34,0.07)',
        'card-hover': '0 6px 28px rgba(74,54,34,0.12)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      }
    }
  },
  plugins: []
}
