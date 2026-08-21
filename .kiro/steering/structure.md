# Project Structure

## Root

```
src/
├── App.jsx           # Root component — owns activeTab, booted, terminal state
├── main.jsx          # ReactDOM.createRoot entry point
├── index.css         # Tailwind directives + all custom CSS (theme, animations, components)
├── assets/           # Static images: profile photo, project screenshots, education logos
├── components/       # All UI components (flat — no subdirectories)
├── constants/        # Portfolio data (one file)
├── hooks/            # Custom React hooks
└── lib/              # Pure utility functions + co-located tests
```

## components/

All components live flat in one directory. Key ones:

| File | Role |
|---|---|
| `PixelWindow.jsx` | Reusable pixel-art notched window frame — wraps all major UI panels |
| `ContentPanel.jsx` | Tabbed content switcher with `AnimatePresence` transitions |
| `Rail.jsx` | Left sidebar: identity card, nav tablist, quote |
| `Taskbar.jsx` | Fixed top bar |
| `Ticker.jsx` | Scrolling system-log marquee strip |
| `BootScreen.jsx` | Fullscreen boot overlay with FLIP morph into hero terminal |
| `AboutPanel.jsx` | Terminal emulator panel (typewriter intro + interactive CLI) |
| `CareerSection.jsx` | Experience entries as OS process rows |
| `ProcessRow.jsx` | Individual career card (used by CareerSection) |
| `Projects.jsx` / `ProjectModal.jsx` | Project grid + detail modal |
| `Uses.jsx` | Tech stack panel |

## constants/

`src/constants/index.js` — **single source of truth for all portfolio data**: `HERO_CONTENT`, `ABOUT_TEXT`, `EDUCATION`, `EXPERIENCES`, `PROJECTS`, `SMALL_PROJECTS`. Also imports and re-exports asset images. Edit here to update displayed content.

## hooks/

| File | Purpose |
|---|---|
| `useMediaQuery.js` | Live `matchMedia` listener |
| `useReducedMotion.js` | Wraps `useMediaQuery` for `prefers-reduced-motion` |
| `useTypewriter.js` | Character-by-character typing animation, cancellable |
| `useTerminal.js` | Full terminal state machine: scripted intro, command history, `runCommand` |
| `useCodeStats.js` | Fetches coding stats from codestats.net API |

## lib/

Pure functions with co-located Vitest tests (`*.test.js`):

| File | Purpose |
|---|---|
| `tabs.js` | `TAB_IDS` array + `tabButtonId` / `tabPanelId` ARIA helpers |
| `terminalCommands.js` | `COMMANDS` list + `parseCommand()` |
| `clock.js` | `formatClock()`, `liveAge()` |
| `pid.js` | `pidFor()` — fake OS process IDs for career entries |
| `resume.js` | `downloadResume()` helper |

## Naming Conventions

- **Components** → PascalCase `.jsx` (`PixelWindow.jsx`)
- **Hooks** → camelCase `use*.js` (`useReducedMotion.js`)
- **Lib utilities** → camelCase `.js` (`terminalCommands.js`)
- **Data constants** → `SCREAMING_SNAKE_CASE` named exports
- **Tests** → co-located `*.test.js` in `lib/`

## Architecture Notes

- **No router** — navigation is a single `activeTab` string in `App.jsx`. `TAB_IDS` in `src/lib/tabs.js` is the single source of truth for section IDs; both `Rail` (nav) and `ContentPanel` (content) import from it.
- **State lifting** — `useTerminal` state lives in `App.jsx` so it survives tab switches (the About panel unmounts/remounts on navigation).
- **ARIA wiring** — `tabButtonId` / `tabPanelId` helpers are used to wire `tablist`/`tab`/`tabpanel` roles across the `Rail` ↔ `ContentPanel` component boundary.
- **Reduced motion** — every animated component checks `useReducedMotion()` and skips or instantly settles animations. New animated components must follow this pattern.
- **Styling** — use Tailwind utilities for layout/spacing/color. Reserve custom CSS classes in `index.css` for complex animated elements or structural patterns that don't map cleanly to utilities (e.g., `.pf-outer`, `.boot-screen`, `.btn`).
