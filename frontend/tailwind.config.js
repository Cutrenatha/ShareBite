/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { brand: { primary: '#E8621A', secondary: '#F5A623', light: '#FFF4EC', dark: '#1A0F05' } },
      fontFamily: { display: ['Nunito','system-ui','sans-serif'], body: ['Plus Jakarta Sans','system-ui','sans-serif'] },
      animation: { 'fade-in': 'fadeIn 0.3s ease-in-out', 'slide-up': 'slideUp 0.4s ease-out' },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
      },
      boxShadow: { warm: '0 4px 24px -4px rgba(232,98,26,0.15)', 'warm-lg': '0 8px 40px -8px rgba(232,98,26,0.25)', card: '0 2px 16px rgba(0,0,0,0.06)' }
    }
  },
  plugins: []
}
