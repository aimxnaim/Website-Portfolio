# Terminal/OS Redesign — Design

**Date:** 2026-08-19
**Status:** Approved for planning
**Reference:** `docs/reference-design.html` (vanilla HTML/CSS/JS mockup, 1165 lines)

## Goal

Replace the current gold/RPG theme with a Dracula-palette terminal-OS aesthetic, ported
to React on the existing Vite + Tailwind stack. Content stays driven by
`src/constants/index.js`; the visual layer is rebuilt.

The redesign also fixes a structural problem in the reference: the hero terminal reads as
a standalone widget parked at the top. See "The terminal as nav" below.

## Non-goals

- No content rewrites. Copy in `constants/index.js` is ported as-is except where the
  reference tightened project bullets (see "Content deltas").
- No change to hosting, build, or deploy. Vite + Vercel unchanged.
- No routing. The site stays a single page with tabbed panels.

## Deferred (explicitly out of scope)

**The easter-egg dodge game.** The reference includes a Chrome-dino clone
(`#gameCanvas`, ~150 lines of JS, plus a 5-option emoji character picker). The user
decided on 2026-08-19 not to ship it. Do not port:

- the `#game` `<section>` markup
- the JS IIFE at reference lines 1010–1160
- CSS rules `.game-screen`, `#gameCanvas`, `.game-overlay`, `.game-overlay-inner`,
  `.game-hint`, `.char-grid`, `.char-option`, `.char-emoji`, `.char-name`

It may be revisited later. The reference file is kept in the repo so the implementation
is recoverable without going back to the original chat.

## Theme foundation

### Palette (`tailwind.config.js`)

The `gold` and `rpg` colour scales are removed and replaced:

| Token | Value | Role |
|---|---|---|
| `bg` | `#282a36` | page background |
| `panel` | `#2d2f3d` | window interiors |
| `panel2` | `#44475a` | title bars, chips, bar tracks |
| `outline` | `#000000` | every border and hard shadow |
| `text` | `#f8f8f2` | body text |
| `muted` | `#9aa5ce` | secondary text |
| `green` | `#50fa7b` | primary accent, prompts, CTAs, RUNNING badge |
| `purple` | `#bd93f9` | secondary accent, role line, grid lines |
| `cyan` | `#8be9fd` | education accent, MP bar, COMPLETED badge |
| `pink` | `#ff79c6` | LIVE badge |
| `orange` | `#ffb86c` | CODE badge, ticker `[INFO]` |
| `red` | `#ff5555` | HP bar, error states |

### Typography

| Family | Use |
|---|---|
| Press Start 2P | headings, eyebrows, section labels only |
| JetBrains Mono | all UI chrome — nav, tabs, badges, tags, terminal, stats |
| Space Grotesk | prose — intro paragraph, description bullets, quote |

`VT323` and `Inter` are dropped. Update the Google Fonts `@import` in `index.css`.

### Surfaces (`index.css`)

The `.rpg-panel` / `.rpg-panel-sm` / `.rpg-panel-dim` family (rounded corners, translucent
gold borders, blurred drop shadows) is replaced by the pixel-window system:

- `.pf-outer` — black padding box, acts as the border
- `.pf-inner` — panel-coloured interior
- `.pf-clip` — `clip-path` polygon producing notched corners
- `.pf-sm` / `.pf-lg` — size variants via `--pf-step` / `--pf-border`
- `.win-bar` — title bar with three traffic-light `.dot`s and a mono title

Buttons use `border: 3px solid black` + `box-shadow: 4px 4px 0 black`, translating on
hover/active. This is the biggest visual shift: **soft/rounded becomes hard-edged/chunky.**

Three global overlays, all `pointer-events: none`:

- grid background — `body::before`, two linear-gradients at 28px
- CRT scanlines — `body::after`, `z-index: 55`, repeating 3px gradient at 0.45 opacity
- particle field — 9 absolutely-positioned drifting dots

**Performance deviation from the reference:** the reference applies
`filter: drop-shadow(6px 6px 0)` to every `.pf-outer`, and animates a glow on the hero's
window on a 4s loop. `drop-shadow` on a `clip-path` element is expensive to composite, and
the projects tab renders ~15 of them. Keep the animated glow on the hero terminal only;
use a static `box-shadow` for all other windows.

## Component structure

```
App.jsx
├─ BootScreen.jsx      NEW  kernel lines, morphs into Hero
├─ Taskbar.jsx         NEW  logo, nav links, ONLINE dot, live clock
├─ ScrollProgress.jsx  NEW  striped fill bar
├─ Backdrop.jsx        NEW  grid + scanlines + particles
├─ Hero.jsx            NEW  terminal; doubles as site nav
├─ Ticker.jsx          NEW  `tail -f system.log` marquee
├─ Intro.jsx           NEW  ABOUT_TEXT paragraph
├─ Sidebar.jsx         REWRITE  same content, new skin
├─ ContentPanel.jsx    REWRITE  gains per-tab window titles
│   ├─ ProcessRow.jsx  NEW  shared by career + projects
│   ├─ CareerSection.jsx   RESTYLE
│   ├─ Education.jsx       RESTYLE
│   ├─ Projects.jsx        RESTYLE
│   ├─ Uses.jsx            RESTYLE
│   └─ ProjectModal.jsx    RESTYLE
└─ hooks/
    ├─ useCodeStats.js     UNCHANGED
    ├─ useTypewriter.js    NEW
    └─ useReducedMotion.js NEW
```

### Design decisions

**`ProcessRow` is shared.** The reference duplicates identical markup for career entries
and project entries — same PID column, name, status badge, bullet list, tag row, link row.
Extract one component taking `{ pid, name, badge, sub, bullets, tags, links, image }`.

**PIDs are derived, not hardcoded.** The reference hardcodes `0142`, `0288`, `0417`,
`0553`, `0691`, `0742`, `0800`. Adding an entry to `constants/index.js` would require
hand-picking a number. Derive them instead:

```js
const pidFor = (seedIndex) => String(142 + seedIndex * 137).padStart(4, "0")
```

Career rows seed from their own index; project rows seed from `EXPERIENCES.length + index`
so the two lists never collide. This yields `0142`, `0279`, `0416`… — plausible, stable
across renders, and requiring no manual step when an entry is added. PIDs are decorative;
they do not need to match the reference's exact numbers.

**`react-simple-typewriter` is removed.** The sidebar role typewriter is ~20 lines of
plain JS in the reference, and the hero needs custom prompt-then-result timing the library
does not express. A shared `useTypewriter` hook replaces the dependency.

**`useCodeStats.js` is untouched.** It already returns `langs`, `machines`, `hp`, `mp`,
`totalXp`, `loading`, `error` — exactly what the reference's stack tab renders, including
the same `IGNORED_LANGS` noise filter. The reference re-implements this inline; use the
existing hook instead.

**Imagery is kept and restyled** (decided 2026-08-19). The reference has no `<img>` except
the avatar. Retain: EY and Ryt Bank logos on career rows, project screenshots, UiTM /
Matriculation / MRSM crests on education rows, and `ProjectModal`. Screenshots get a
`.pf-outer` pixel frame; logos become small bordered chips in the `.proc-head`.

**Assets come from files, not base64.** The reference inlines the avatar (48KB) and the
resume PDF (240KB) as data URIs. Use the existing `src/assets/aiman.jpg` and
`public/Aiman_Naim_Resume.pdf`.

## The terminal as nav

The problem being solved: in the reference, the page opens with three terminal-flavoured
things in a row — boot screen, hero terminal, ticker. The boot screen already performs
"terminal types at you", so the hero terminal repeats it and reads as decoration. Below the
ticker the metaphor vanishes entirely. The terminal is redundant above and unsupported
below.

### Boot morphs into hero

The reference fades the boot screen out (`opacity: 0` → `display: none`) and then starts a
separate hero terminal typing. Instead, treat them as one object:

1. Boot window renders fullscreen, kernel lines print at 220ms intervals.
2. On dismiss, the same element animates to hero size and position (FLIP: measure both
   rects, transform between them).
3. Kernel lines scroll up out of view as `AIMAN NAIM` types in beneath them.

The viewer never sees two terminals. They watch one become the other.

### Live prompt

Below the four `$ whoami` / `$ role --current` / `$ mission` / `$ status` lines, the prompt
stays interactive.

| Command | Effect |
|---|---|
| `career` / `education` / `projects` / `stack` | switch tab, scroll to panel |
| `help` | list available commands |
| `clear` | reset terminal to the prompt |
| `resume` | download the PDF |
| anything else | `command not found: <x>` |

The `▶ VIEW_CAREER` / `📁 VIEW_PROJECTS` buttons remain for discoverability. They write the
command into the prompt and execute it, so both paths visibly do the same thing.

**Mobile:** focusing a text input summons the OS keyboard over the content. Below the
`900px` breakpoint the prompt renders as tappable command chips instead of an input.

## Accessibility & motion

`prefers-reduced-motion: reduce` must disable: the boot sequence (render the page
directly), all typewriter effects (render final text), both marquees, the particle field,
the hero glow, scroll-reveal transforms, and smooth scrolling. The reference handles most
of this; extend it to cover the new boot→hero morph.

**Boot gating.** The reference sets `body.boot-active { overflow: hidden }` and holds the
viewer for roughly 4 seconds on every page load, auto-dismissing on a 2.4s timer after the
lines finish. Add:

- a visible skip affordance during boot
- `sessionStorage` completion flag, so boot plays once per session rather than once per
  page load

**Focus.** Every interactive element keeps the reference's
`outline: 3px solid var(--purple); outline-offset: 3px` on `:focus-visible`. Tab buttons
need `role="tab"` / `aria-selected`; panels need `role="tabpanel"`.

**Decorative content** — particles, scanlines, ticker, traffic-light dots — gets
`aria-hidden="true"`.

## Content deltas

The reference tightened some copy relative to `constants/index.js`. Resolve as follows:

- **Project bullets:** the reference condenses 5 bullets to 3 for Gadget Universe and
  drops some tags. Keep the fuller `constants/index.js` versions — `ProjectModal` shows
  detail, and the tighter text loses substance.
- **Ryt Bank badge:** reference says `COMPLETED` (`.badge.stable`). Correct; use it.
- **Sidebar footer:** reference reads "Built with HTML, CSS & JS — pixel/terminal edition".
  Must become React + Tailwind + Vite, since that is what ships.
- **`Website Portfolio` project entry:** its description references the current stack.
  Update once the redesign lands.
- **Hardware grid:** reference matches `Uses.jsx` `GEAR` exactly (MacBook Air M5, AirPods
  Pro 2, RK RK61, Razer DeathAdder). No change.
- **Tools marquee:** reference `TOOLS` is a plain string array; `Uses.jsx` `TOOLS` carries
  icons and colours. Keep the richer existing version.

## Testing

No test infrastructure exists in this repo, and this is a presentational rewrite — the
verification that matters is visual and behavioural, run against `npm run dev`:

- boot plays once, skips on repeat visit within a session, and is bypassed entirely under
  reduced motion
- boot→hero morph is continuous, with no frame showing two terminals
- each terminal command switches the correct tab and scrolls to it
- unknown commands report `command not found`
- tabs are keyboard-navigable and announce correctly
- CodeStats bars populate; the failure path renders `COULD NOT REACH CODESTATS.NET`
- layout holds at 375px, 768px, 1280px — mobile shows command chips, not an input
- `npm run lint` passes with `--max-warnings 0`
- `npm run build` succeeds

## Risks

- **Scope.** Eight new components plus five rewrites. Sequence so the theme foundation
  lands first and each component is verifiable on its own.
- **The boot→hero morph is the hardest piece.** FLIP between a fullscreen element and a
  laid-out one is fiddly. If it resists, fall back to a cross-fade in place (same position,
  no size animation) rather than reverting to two separate terminals — the continuity
  matters more than the specific animation.
- **Scanlines at `z-index: 55`** sit above most content. Verify `ProjectModal` renders
  above them, or it will look veiled.
