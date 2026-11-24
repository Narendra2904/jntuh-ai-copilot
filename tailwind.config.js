/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#09090B',
        bento: {
          card: '#121215',
          elevated: '#18181B',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(250, 204, 21, 0.15)',
        },
        gold: {
          400: '#FDE047',
          500: '#FACC15',
          600: '#EAB308',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      },
      boxShadow: {
        'bento': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'gold-glow': '0 0 25px -5px rgba(250, 204, 21, 0.3)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}
