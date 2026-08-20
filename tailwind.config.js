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
      // Raises the floor: nothing below 10px, and 10px only for the
      // Press Start 2P eyebrow labels where the face reads as texture.
      // Overriding here fixes every text-xs / text-sm call site at once.
      fontSize: {
        label: ['10px', { lineHeight: '1.6', letterSpacing: '0.08em' }],
        xs:    ['13px', { lineHeight: '1.5' }],
        sm:    ['15px', { lineHeight: '1.6' }],
        base:  ['16px', { lineHeight: '1.7' }],
        lg:    ['18px', { lineHeight: '1.6' }],
      },
    },
  },
  plugins: [],
}
