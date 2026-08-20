/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        term: {
          bg:      '#282a36',
          panel:   '#2d2f3d',
          panel2:  '#44475a',
          outline: '#000000',
          text:    '#f8f8f2',
          muted:   '#9aa5ce',
        },
        acc: {
          green:  '#50fa7b',
          purple: '#bd93f9',
          cyan:   '#8be9fd',
          pink:   '#ff79c6',
          orange: '#ffb86c',
          red:    '#ff5555',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
