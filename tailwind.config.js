/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0A0A0F', 2: '#111118', 3: '#1A1A24', 4: '#22222E' },
        g: { 100: '#F0F0F5', 200: '#CFCFD2', 300: '#9A9AA0', 400: '#6B6B73', 500: '#44444C' },
        scarlet: { DEFAULT: '#F9250E', light: '#FF5A45', dark: '#C41E0B' },
        emerald: { DEFAULT: '#10B981' },
        sapphire: { DEFAULT: '#3B82F6' },
        amber: { DEFAULT: '#F59E0B' },
        violet: { DEFAULT: '#8B5CF6' },
        rose: { DEFAULT: '#F43F5E' },
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Libre Baskerville', 'serif'],
        display: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s cubic-bezier(.22,1,.36,1) both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
