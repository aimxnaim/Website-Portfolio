# Tech Stack

## Core

| Layer | Technology |
|---|---|
| Framework | React 18 (functional components + hooks, JSX) |
| Build tool | Vite 5 (`@vitejs/plugin-react` / Babel) |
| Language | JavaScript (`.js` / `.jsx`) — no TypeScript source files |
| Styling | Tailwind CSS 3.4 + custom CSS in `src/index.css` |
| Animation | Framer Motion 11 (`AnimatePresence`, `motion.div`) |
| Icons | react-icons 5 |
| Analytics | `@vercel/analytics` |
| Prop validation | `prop-types` (runtime, required on all non-trivial components) |
| Testing | Vitest 2 |

## Design Tokens (Tailwind theme)

Custom color palette in `tailwind.config.js`:

- `term.bg / panel / panel2 / outline / text / muted` — background and text colors (Dracula-inspired dark theme)
- `acc.green / purple / cyan / pink / orange / red` — accent colors

Custom fonts: `font-pixel` (Press Start 2P), `font-mono` (JetBrains Mono), `font-sans` (Space Grotesk).

Custom font sizes override Tailwind defaults — minimum rendered size is 13px (`text-xs`). Use `text-label` (10px) only for Press Start 2P eyebrow labels.

## CSS Custom Properties

Defined in `src/index.css` `:root`, consumed in both Tailwind classes and raw CSS:

- `--taskbar-h: 60px` — fixed taskbar height
- `--rail-top: 76px` — sticky sidebar offset
- `--pf-step / --pf-border` — pixel-window frame sizing

## Commands

```bash
npm run dev          # Vite dev server with HMR
npm run build        # Production build → dist/
npm run preview      # Serve production build locally
npm run lint         # ESLint — zero warnings allowed
npm run test         # Vitest single run
npm run test:watch   # Vitest watch mode
```

## Linting

ESLint 8 with `eslint:recommended`, `plugin:react/recommended`, `plugin:react/jsx-runtime` (new JSX transform — no `import React` needed), `plugin:react-hooks/recommended`, and `react-refresh`. Max warnings: 0. No Prettier config — formatting is ESLint-only.
