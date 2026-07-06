# Mobile-Responsive Polish Pass — Design

**Date:** 2026-07-06
**Branch:** side-bar-update
**Author:** Aiman Naim

## Goal

The two-column sidebar layout (see `2026-06-25-sidebar-layout-redesign-design.md`) already
stacks correctly on small screens, but several components were tuned for desktop widths and
look cramped, overflow, or feel oversized on phones (~360–428px) and tablets (~768–1024px).
This is a targeted Tailwind-utility polish pass — no new dependencies, no structural or
navigation changes.

## Approach

Add/adjust responsive breakpoint classes (`sm:`, base mobile-first) on existing markup,
following the codebase's existing convention (`hidden sm:block`, `lg:flex-row`, etc.).
Rejected: CSS `clamp()`-based fluid typography — bigger blast radius for a pixel-art
aesthetic that already uses discrete Tailwind size steps.

## Issues & Fixes

### `src/components/Experiences.jsx`
Quest header bar (`flex items-center justify-between px-5 py-3`, no wrap) can overflow when
the year range + duration badge don't fit on one line at ~360px. Add `flex-wrap gap-2` and
reduce to `px-4 py-3 sm:px-5`. Reduce body padding `p-5` → `p-4 sm:p-5`.

### `src/components/Education.jsx`
Same chapter-card padding treatment: `p-4` body is already reasonable; tighten the outer
`gap-4` → `gap-3 sm:gap-4` so the marker + content don't feel squeezed at 360px.

### `src/components/Uses.jsx`
`XpBars` fixed label widths (`w-28` name, `w-20` XP) leave too little room for the bar
itself at 360px. Shrink to `w-20 sm:w-28` and `w-14 sm:w-20`. Panel padding `p-6` → `p-4
sm:p-6` across the three `rpg-panel` blocks.

### `src/components/ContentPanel.jsx`
Panel padding `p-6` → `p-4 sm:p-6`.

### `src/components/Sidebar.jsx`
Name `text-4xl` → `text-3xl sm:text-4xl`. Panel padding `p-5` → `p-4 sm:p-5`.

### `src/components/ProjectModal.jsx`
Body padding `p-6` → `p-4 sm:p-6`. Title `text-4xl` → `text-3xl sm:text-4xl`.

### `src/components/CareerSection.jsx`, `Projects.jsx`
Section header titles `text-5xl lg:text-6xl` → `text-4xl sm:text-5xl lg:text-6xl` (applies
to all four section headers: QUEST LOG, ORIGIN STORY, ACHIEVEMENTS, USES & LOADOUT — the
same pattern appears in `Experiences.jsx`, `Education.jsx`, `Projects.jsx`, `Uses.jsx`).

### `src/App.jsx`
Outer container gutter `px-6 lg:px-8` → `px-4 sm:px-6 lg:px-8` to rebalance against the
reduced panel padding above (keeps total inset roughly constant on phones instead of
compounding two full-size paddings).

## Out of Scope

- No hamburger/collapsible nav — sidebar-on-top stacking is kept as-is.
- No changes to desktop (`lg:`) breakpoint behavior.
- No new components or dependencies.

## Testing / Verification

No test runner configured. Verification:
1. `npm run build` and `npm run lint` pass.
2. Manual check via `npm run dev` at 360px, 390px, 428px (phone) and 768px/1024px (tablet)
   widths: no horizontal overflow, header text fits without wrapping awkwardly, Experiences
   header bar doesn't overflow, tap targets remain comfortable.
