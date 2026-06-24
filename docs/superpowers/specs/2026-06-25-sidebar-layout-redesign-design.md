# Sidebar Layout Redesign — Design

**Date:** 2026-06-25
**Branch:** resume-gaming-update
**Author:** Aiman Naim

## Goal

Restructure the portfolio from a vertical stack (Navbar → Hero → About → Tabs → Footer)
into a **two-column layout**: a persistent left sidebar (identity/profile) and a right
content panel with top navigation that switches between sections. Keep the existing RPG
gaming visual theme (gold accents, pixel font, RPG panels, HP/MP bars).

Inspired by the layout of itsmeray.com, reinterpreted in the existing RPG style.

## Layout Overview

```
┌─────────────────────────────────────────────────────────┐
│ [Left Sidebar — sticky]   │  [Right Content Panel]        │
│                           │  Career  Education  Proj  Uses │ ← top nav (tabs)
│  [ PHOTO / portrait ]     │ ───────────────────────────── │
│  AIMAN NAIM               │  ► ABOUT ME (bio intro)        │
│  Kuala Lumpur · Age 24    │  short bio paragraph...        │
│  {typewriter class}       │                                │
│  HP ▓▓▓▓░  MP ▓▓▓░         │  ► QUEST LOG / CAREER          │
│                           │  ┌──────────────────────┐      │
│  ◦ LinkedIn ◦ GitHub      │  │ EY · Full Stack Dev  │      │
│  ◦ Insta ◦ Threads        │  │ Ryt Bank · Intern    │      │
│  ◦ Discord ◦ Resume       │  └──────────────────────┘      │
│                           │                                │
│  "words I live by" quote  │                                │
└─────────────────────────────────────────────────────────┘
                    ― THE END ― (footer, full width)
```

- Desktop (`lg`): `flex-row`. Sidebar is a fixed-width (~320px) sticky column
  (`lg:sticky lg:top-6 lg:self-start`). Right panel takes remaining width.
- Mobile/tablet: `flex-col`. Sidebar stacks on top, full width, not sticky.
- Footer remains full-width below the two columns.

## Navigation Mechanism

**Approach A — Tab-switch** (chosen). One section visible at a time. Clicking a top-nav
button swaps the active section with a Framer Motion `AnimatePresence` fade. Active tab
held in `useState`, default `"career"`. No new dependencies. This reuses the exact pattern
already in `src/components/Tabs.jsx`.

Rejected: scroll-spy (more code, longer page) and react-router (adds a dependency for a
single-page portfolio).

## Components

### New: `src/components/Sidebar.jsx`
Persistent left identity panel. Contents top-to-bottom:

1. **Portrait** — `src/assets/aiman.jpg`, framed in an RPG panel (reuse Navbar's framed
   portrait styling with the `LV.24` badge).
2. **Name** — "AIMAN NAIM" (rpg-font, gold).
3. **Meta line** — `Kuala Lumpur · Age {liveAge}` where `liveAge` is computed (see Age
   Calculation below).
4. **Class** — typewriter line moved from `Hero.jsx`, using `react-simple-typewriter`
   with the existing word list
   (`Full Stack Developer`, `Front End Developer`, `Back End Developer`, `Coder`,
   `Programmer`, `Software Engineer`, `Tech Enthusiast`).
5. **HP / MP bars** — moved from `Navbar.jsx` (HP 90/100, MP 75/100) for RPG flavor. For the HP and MP bard, can take the value from codestats date which is the value of the total XP on the latest day . HP is the total XP on the latest day and MP is the total XP on the previous day. The bars are rendered as RPG-style progress bars (reuse Navbar's `hp-bar` and `mp-bar` styling).
6. **Social row** — RPG action buttons (reuse Navbar's `rpg-panel-dim` button style):
   - LinkedIn → `https://www.linkedin.com/in/aimannaimfaizul/`
   - GitHub → `https://github.com/aimxnaim`
   - Instagram → `https://www.instagram.com/aimxnaim/`
   - Threads → `https://www.threads.com/@aimxnaim`
   - Discord → copy username `mxxn512` to clipboard on click (id `753300998738673736`),
     show a brief "COPIED" tooltip/state. Not a link.
   - Resume → downloads `/Aiman_Naim_Resume.pdf` (reuse Navbar's `downloadResume`).
7. **Quote box** — "words I live by", RPG dialog/panel styling:
   > So surely with hardships comes ease - Surah Ash-Sharh, Ayat 5

### New: `src/components/ContentPanel.jsx`
Right-side panel. Top RPG nav bar with 4 tab buttons, then the active section rendered
below with `AnimatePresence` fade. Tabs (in order, Career default):

| id          | label (RPG)    | short    | component        |
|-------------|----------------|----------|------------------|
| `career`    | QUEST LOG      | CAREER   | CareerSection    |
| `education` | ORIGIN STORY   | ORIGIN   | Education (exist)|
| `projects`  | ACHIEVEMENTS   | ACHIEVE  | Projects (exist) |
| `uses`      | EQUIPMENT      | USES     | Uses (new)       |

This may be implemented by adapting the existing `Tabs.jsx` rather than a brand-new file —
whichever is cleaner. The icon set (`react-icons/fa`) and active-button styling from
`Tabs.jsx` are reused.

### New: `src/components/CareerSection.jsx`
- Top: `► ABOUT ME` intro block — renders `ABOUT_TEXT` from `src/constants/index.js` in a
  dialog box.
- Below: the existing `Experiences` quest-log timeline (rendered as-is or inlined).

### Modified: `src/components/Technology.jsx` → folded into Uses
The equipped-skills/tools grid and the already-built Code::Stats language XP bars become
part of the new **Uses** section.

### New: `src/components/Uses.jsx`
Combines, top-to-bottom:
1. **Tools** — the equipped-skills inventory grid (from current `Technology.jsx`).
2. **Code::Stats — Languages** — language XP bars (already built in `Technology.jsx`).
3. **Code::Stats — Machines** — NEW. Machine XP bars from the API's `machines` block,
   same bar styling as languages, sorted by XP descending, top N.
4. **Gear** — NEW `GEAR` subsection with placeholder hardware slots (laptop, keyboard,
   mouse, monitor, etc.) to be filled in later with real data. Render as RPG inventory
   slots with placeholder labels.

### Modified: `src/App.jsx`
Replace the current stack with the two-column shell:

```jsx
<div className="container ...">
  <div className="flex flex-col lg:flex-row gap-8">
    <Sidebar />            {/* ~320px sticky on lg */}
    <ContentPanel />       {/* flex-1 */}
  </div>
  <Footer />
  <Analytics />
</div>
```

### Removed
- `src/components/Hero.jsx` (status screen) — typewriter class moves to Sidebar; the rest
  (big name, stat blocks, scroll hint) is dropped.
- `src/components/About.jsx` — portrait moves to Sidebar; bio (`ABOUT_TEXT`) moves to
  CareerSection; the RPG stat bars (STR/INT/DEX/WIS/CHA/LCK) are **dropped** per decision.
- `src/components/Navbar.jsx` — identity (portrait, name, HP/MP) and socials fold into the
  Sidebar; the standalone top navbar is removed.

### Unchanged
- `Education.jsx`, `Projects.jsx`, `ProjectModal.jsx`, `Experiences.jsx` (reused as-is),
  `Footer.jsx`.

## Age Calculation

Born **December 2001**. Compute live so it never needs manual updates:

```js
const BIRTH_YEAR = 2001;
const BIRTH_MONTH = 12; // December (1-indexed)
const now = new Date();
const age = now.getFullYear() - BIRTH_YEAR
  - (now.getMonth() + 1 < BIRTH_MONTH ? 1 : 0);
```

As of 2026-06-25 this yields **24**; it becomes 25 in December 2026 automatically.
(Day-of-month is unknown, so the rollover happens at the start of December — acceptable.)

## Data Flow

- **Active tab:** `useState("career")` in `ContentPanel` (or adapted `Tabs`).
- **Code::Stats fetch:** existing `useCodeStats` hook in `Technology.jsx`, extended to also
  parse and return the `machines` block (array of `{ name, xp }`, sorted desc) alongside
  `langs` and `totalXp`. The hook moves into / is shared by the Uses section.
- **Discord copy:** `navigator.clipboard.writeText("mxxn512")` with a transient
  `copied` state for UI feedback.
- **Age:** pure computation at render (above).

## Error Handling

- Code::Stats fetch failure → existing `error` state shows "FAILED TO LOAD STATS" for both
  languages and machines blocks; loading state shows "LOADING STATS...".
- Clipboard API unavailable → fall back to showing the raw username text so it can be
  copied manually.

## Responsive Behavior

- `< lg`: single column, sidebar on top (full width, static), content below.
- `>= lg`: two columns, sidebar `~320px` sticky (`lg:sticky lg:top-6 lg:self-start`),
  content `flex-1`.
- Social buttons wrap; tab nav wraps (existing `flex-wrap` pattern).

## Testing / Verification

This is a Vite + React static site with no test runner configured. Verification:

1. `npm run build` passes with no errors.
2. `npm run lint` passes (max-warnings 0).
3. Manual/visual check via `npm run dev`:
   - Two-column layout on desktop; sidebar sticky on scroll.
   - Single column on mobile (sidebar on top).
   - All 4 tabs switch with fade; Career is default and shows About-me + timeline.
   - Sidebar age shows 24; typewriter cycles; HP/MP bars render.
   - All social links open correct URLs; Discord copies username; Resume downloads.
   - Uses section shows tools grid + language XP + machine XP + gear placeholders.

## Open Items / Placeholders

- **Gear data** — hardware list to be provided later; built with placeholder slots for now.
- **Day-of-month for birthday** — unknown; age rolls over at start of December.

## Out of Scope

- No new runtime dependencies.
- No routing / deep links.
- No backend; Code::Stats is fetched client-side from the public API.
- No physical gear data yet (placeholders only).
