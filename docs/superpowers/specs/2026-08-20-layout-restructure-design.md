# Layout Restructure — Design

**Date:** 2026-08-20
**Status:** Awaiting user review
**Builds on:** `docs/superpowers/specs/2026-08-19-terminal-os-redesign-design.md` (shipped, uncommitted on `redesign/terminal-os`)

## Problem

The terminal-OS redesign works, but the page opens badly. `Hero` is `min-h-[92vh]`,
so the terminal owns the entire first screen. Below it sit a ticker, an untitled
paragraph, and only then the sidebar and content panel. A first-time visitor sees a
terminal and no indication that career, education, projects, or stack exist. They have
to scroll on faith.

Three secondary problems compound it:

1. **Navigation is duplicated.** The taskbar has four nav links and `ContentPanel` has
   four tab buttons. They do the same thing, in two places, styled differently.
2. **`ABOUT_TEXT` is orphaned.** It renders as an untitled paragraph between the ticker
   and the panel, belonging to no section.
3. **Type is too small.** 37 declarations at ≤12px, including six at 8px in
   Press Start 2P — a face with no descenders and a tiny x-height.

## Goal

Turn the page from a scroll into an app. Everything reachable from screen one, no
scroll required to discover that content exists.

## Non-goals

- **No theme change.** Palette, fonts, pixel-window system, buttons, badges, ticker,
  scanlines, particles, boot screen all stay exactly as they are.
- **No content rewrites.** `constants/index.js` is untouched.
- **No routing.** Still a single page with tabbed panels.
- **No new dependencies.**

## Target layout

```
┌ taskbar (fixed, z-70) ───────────────────────────────────┐
│ aiman@system    in  gh  ig  th  dc    [RESUME]  ● 12:34  │
├ ticker: tail -f system.log ──────────────────────────────┤
├──────────────┬───────────────────────────────────────────┤
│ [photo] LV24 │ ┌ aiman@root: ~/about ──────────────────┐ │
│ AIMAN NAIM   │ │ $ whoami                              │ │
│ KL · Age 24  │ │ aiman naim — full stack developer     │ │
│ [ role... ]  │ │ $ _                                   │ │
│              │ └───────────────────────────────────────┘ │
│ ► ABOUT      │                                           │
│   CAREER     │ I'm a Full Stack Developer at Ernst &     │
│   EDUCATION  │ Young, building secure compliance...      │
│   PROJECTS   │                                           │
│   STACK      │                                           │
│              │                                           │
│ " hardship " │                                           │
│ built with…  │                                           │
└──────────────┴───────────────────────────────────────────┘
   sticky rail          document scroll
```

**Scrolling model.** The document scrolls normally; the rail is `position: sticky`.
This is deliberately *not* an internal-scroll app shell — nesting a scroll container
inside a fixed-height wrapper fights mobile dynamic viewports and traps wheel events,
and the Projects tab is genuinely long. A sticky rail achieves the goal (navigation is
never lost) without any of that. `ScrollProgress` therefore stays, and still means
something on the long tabs.

The About, Education, and Stack tabs fit one screen. Career and Projects scroll — but
the rail stays pinned, so scrolling always reads as "more of this section", never as
"there is a whole site down here."

## Component changes

| File | Change |
|---|---|
| `Hero.jsx` | → **`AboutPanel.jsx`.** Same terminal, same typing, same live prompt, same mobile chips. Loses the `min-h-[92vh]` section wrapper and the two CTA buttons; gains `ABOUT_TEXT` beneath the terminal. |
| `Intro.jsx` | **Deleted.** Its only job was rendering `ABOUT_TEXT`, which now lives in `AboutPanel`. |
| `Sidebar.jsx` | → **`Rail.jsx`.** Loses the 6-button social grid; gains the vertical nav. Keeps portrait, LV badge, name, location, role typewriter, quote, credits. |
| `ContentPanel.jsx` | Loses its horizontal tab strip (the rail owns navigation). Gains `about` as a fifth tab. Keeps `PixelWindow`, per-tab titles, `AnimatePresence` transition, `role="tabpanel"`. |
| `Taskbar.jsx` | Loses its `NAV` links. Gains social icons + a filled Resume button. |
| `App.jsx` | New two-column shell. Default tab becomes `about`. |
| `BootScreen.jsx` | Morph target changes from the hero wrapper to the About panel's terminal wrapper. Same FLIP code, different rect. |
| `terminalCommands.js` | `TABS` gains `about`. |

`PixelWindow`, `ProcessRow`, `Backdrop`, `Ticker`, `ScrollProgress`, `ProjectModal`,
`CareerSection`, `Education`, `Projects`, `Uses`, and all hooks are **unchanged** except
for the type-scale sweep in §Readability.

## The `about` tab

Adding a fifth tab id requires four places to agree. They currently do not share a
constant, and a mismatch fails silently — this exact class of bug bit the `stack`/`uses`
ids during the previous build.

| Location | Current | After |
|---|---|---|
| `App.jsx` initial state | `"career"` | `"about"` |
| `ContentPanel.jsx` `TABS` | 4 entries | 5, `about` first |
| `terminalCommands.js` `TABS` | 4 strings | 5, `about` first |
| `Taskbar.jsx` `NAV` | 4 strings | *removed entirely* |

**Fix the root cause:** export the tab list once from `src/lib/tabs.js` and import it in
both `ContentPanel` and `terminalCommands`. Removing the taskbar's copy takes the count
from four sources of truth to one.

```js
// src/lib/tabs.js
export const TAB_IDS = ["about", "career", "education", "projects", "stack"]
```

`ContentPanel` keeps its own array for the emoji/label/Component mapping but derives its
order and membership from `TAB_IDS`, and `terminalCommands` imports `TAB_IDS` directly.

New window title: `about: "aiman@root: ~/about"`.

## Terminal state ownership

`AboutPanel` unmounts when you switch tabs. Left as-is, that means the scripted four-line
sequence re-types every time you return to About, and command history is lost. Both are
wrong — the terminal is meant to read as one persistent session.

**Lift terminal state into `App.jsx`** and pass it down: `lines`, `done`, `history`, and
`draft`. `AboutPanel` becomes presentational, receiving state and a `runCommand` callback.

The scripted-typing effect moves with the state, so it runs once per page load rather
than once per visit to the tab. On return, `lines` is already fully settled and renders
instantly. This is the same controlled-component pattern `ContentPanel` already uses.

`AboutPanel` keeps ownership of the `isDesktop` media query, since that only affects how
it renders the prompt.

## The rail

`Rail.jsx`, a single `PixelWindow` titled `profile.dat`, sticky beneath the taskbar.

**Only the taskbar is fixed.** The ticker stays in normal document flow directly beneath
it and is allowed to scroll away — it is decorative, and fixing it would mean tracking a
two-part chrome height. That leaves one offset to manage, so define it once in
`index.css` as `--taskbar-h` and consume it in three places: the shell's `padding-top`,
`html { scroll-padding-top }` (replacing the current hardcoded `72px` at
`src/index.css:22`), and the rail's `lg:sticky` top offset (`--taskbar-h` + 16px).
Measure the real rendered taskbar height once the Resume button is in it — the button's
padding, not the text, will set it.

Order top to bottom: portrait + LV badge → name → location/age → role typewriter →
**vertical nav** → quote → credits.

The nav replaces `ContentPanel`'s tab strip and inherits its full ARIA contract —
`role="tablist"` with `aria-orientation="vertical"`, `role="tab"`, `aria-selected`,
`aria-controls`, roving `tabIndex`. Arrow-key handling changes from Left/Right to
**Up/Down** to match the vertical orientation; Home/End stay.

Each item is a full-width left-aligned button: `►` caret (invisible when inactive, so
labels don't shift), emoji, label. Active state keeps the existing
`bg-acc-green text-[#1e1f29]` treatment.

Because the nav lives inside `Rail` but its state lives in `App`, `Rail` takes
`{ active, onTabChange }` — the same two props `ContentPanel` takes today.

The tablist and the tabpanel now live in **different components**. The `id`/`aria-controls`/
`aria-labelledby` wiring still works — those are document-wide id references, not
parent-child relationships — but the `tab-${id}` and `panel-${id}` naming convention has
to stay identical on both sides. Move the two id-builder helpers into `src/lib/tabs.js`
alongside `TAB_IDS` so neither component can drift.

## Socials in the taskbar

Five icon-only links — LinkedIn, GitHub, Instagram, Threads, Discord — plus a filled
Resume button. No text labels; each carries a `title` and an `aria-label`.

**Discord is the awkward one.** It copies `mxxn512` to the clipboard and currently
confirms by swapping its label to `COPIED`. As a bare icon there is no label to swap.
Replacement feedback: the icon flashes `text-acc-green` for 1.5s and a
`role="status"` live region announces `Discord username copied`. Same timing, same
`useState` + `setTimeout`, no label.

**Taskbar at 375px.** Logo + 5 icons + Resume + ONLINE + clock does not fit. Below `sm`,
hide the `ONLINE` dot and the clock; keep logo, icons, and Resume. The clock is
decorative and the phone already shows one.

`downloadResume` is currently duplicated verbatim in `Sidebar.jsx:15-20` and
`Hero.jsx:102-105`. Extract it to `src/lib/resume.js` and import it in both `Taskbar`
(for the button) and `AboutPanel` (for the terminal's `resume` command).

## Readability

The problem is size, not contrast: `#9aa5ce` on `#2d2f3d` measures **5.55:1**, which
passes WCAG AA. Fixing it by darkening or brightening would change the theme for no
benefit.

Fix it at the scale, not the call site. Override Tailwind's font-size keys in
`tailwind.config.js` under `theme.extend.fontSize`:

| Key | Before | After | Line height |
|---|---|---|---|
| `label` *(new)* | — | 10px | 1.6, `letterSpacing: 0.08em` |
| `xs` | 12px | **13px** | 1.5 |
| `sm` | 14px | **15px** | 1.6 |
| `base` | 16px | 16px | **1.7** |
| `lg` | 18px | 18px | 1.6 |

This alone fixes all 25 `text-xs` and 6 `text-sm` call sites with no component edits.
Then sweep the arbitrary values, which both raises the floor and removes the
arbitrary-value sprawl:

| Arbitrary | Count | Becomes |
|---|---|---|
| `text-[8px]` | 6 | `text-label` |
| `text-[9px]` | 3 | `text-label` |
| `text-[10px]` | 1 | `text-label` |
| `text-[11px]` | 2 | `text-xs` |
| `text-[13px]` | 6 | `text-xs` |
| `text-[15px]` | 4 | `text-sm` |

`text-[17px]` and `text-[19px]` (headings) and `text-[clamp(16px,3vw,24px)]` (the
terminal's name line) stay as-is — they are deliberate one-offs above the floor.

Three raw `font-size` declarations in `index.css` bypass Tailwind and need the same
treatment: `12px` at line 190 (`.ticker-label`) → `13px`, and `14px` at lines 81 and 118
→ `15px`. Line 183's `15px` and line 192's `13px` already sit at the floor.

**Result:** nothing below 10px, and 10px used only for Press Start 2P eyebrow labels
where the face is functioning as texture. Body prose lands at 16px/1.7.

**Risk:** Press Start 2P is very wide per character. Bumping 8px → 10px is a 25% width
increase on labels like `WORDS I LIVE BY` and `© 2026 AIMAN NAIM` inside a 320px rail.
Check these for wrapping.

## Mobile

Below `lg` the two columns stack. The rail becomes a full-width card above the panel,
and its vertical nav becomes a **horizontally scrollable chip row**, sticky beneath the
taskbar so navigation stays reachable while the panel scrolls.

The rail's other contents — quote and credits — move **below** the panel on mobile, so
the tap targets aren't buried under a portrait and a blockquote. Implementation: render
identity + nav in one element and quote + credits in another, with `order` utilities
placing them above and below the panel respectively.

`AboutPanel`'s existing 900px chip-vs-input breakpoint is unaffected.

## Boot morph

`BootScreen` measures `heroRef.current.getBoundingClientRect()` as its FLIP target. The
ref now points at `AboutPanel`'s terminal wrapper instead of `Hero`'s. Nothing else in
`BootScreen` changes — the `MIN_STABLE_SCALE` / `MAX_STABLE_SCALE` guards, the
`sessionStorage` gate, the SKIP button, and the reduced-motion bypass all carry over.

Two consequences to verify:

- The About tab must be the active tab when boot runs. It is — `activeTab` initialises
  to `"about"` on every load, and boot only runs at mount.
- The target rect is now smaller and higher on screen than the old 92vh hero's. The
  scale guards exist precisely for this; confirm the computed scale still lands inside
  them rather than being clamped.

If the morph does not survive the new geometry, the documented fallback from the
previous spec still applies: cross-fade in place rather than reverting to two terminals.

## Navigation behaviour

`goToTab` currently calls `scrollIntoView` on `#main`. With the rail always visible and
the panel starting near the top of the viewport, there is nothing to scroll to.

New behaviour: `setActiveTab(id)` plus `window.scrollTo({ top: 0 })` — because switching
from a scrolled position in Projects to a short tab like Stack would otherwise land you
below the content. Respects `prefers-reduced-motion` for the scroll behaviour, as the
current code does.

## Testing

Existing unit tests cover `clock`, `pid`, and `terminalCommands` (27 passing). The
`terminalCommands` suite must gain a case for `about` resolving to `{ type: "tab" }`,
and any test asserting `TABS.length === 4` needs updating.

The rest is visual and behavioural, verified against `npm run dev`:

- Landing on the page shows all five section names without scrolling, at 1280px
- Every nav item switches the panel; the terminal's `about` command does too
- Terminal history and the scripted intro survive a round trip to another tab and back
- Vertical nav is keyboard-navigable with Up/Down/Home/End
- Boot morph still lands on the About terminal with no visible jump
- Discord copy announces without a label swap
- Taskbar does not overflow at 375px
- Rail nav is reachable on mobile while the panel is scrolled
- No Press Start 2P label wraps unintentionally at 10px
- `npm run lint` passes with `--max-warnings 0`; `npm run build` succeeds

## Risks

- **Terminal state lifting is the subtlest change.** The scripted-typing effect has a
  `cancelled` flag guarding React 18 StrictMode double-invocation. Moving it to `App`
  must preserve that guard, or the intro will double-type.
- **Five silent-failure points collapse to one.** Centralising `TAB_IDS` is the mitigation;
  the migration itself is the moment the mismatch could be introduced.
- **Taskbar density between 640px and 1024px** is the tightest fit. Verify at 768px, not
  just at the endpoints.
- **Deleting `Intro.jsx` and renaming two components** touches imports in `App.jsx`.
  Stale imports fail loudly at build time, so this is low-risk.
