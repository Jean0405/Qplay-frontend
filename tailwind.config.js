/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        dark: {
          50: '#a1a1aa',
          100: '#2a2a2a',
          200: '#1e1e1e',
          300: '#141414',
          900: '#0a0a0a',
        }
      }
    },
  },
  plugins: [],
}