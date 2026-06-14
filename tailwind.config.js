/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#fde68a',
          400: '#f0c040',
          500: '#d4a017',
          600: '#b8860b',
        },
        rpg: {
          bg:     '#080b12',
          panel:  '#0d111a',
          border: '#1f2a3c',
          dim:    '#64748b',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        rpg:   ['"VT323"', 'monospace'],
      },
    },
  },
  plugins: [],
}
