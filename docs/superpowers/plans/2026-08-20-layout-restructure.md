# Layout Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the portfolio from a scroll into an app — a fixed taskbar, a sticky left rail that owns navigation, and a content panel whose default tab is a new About section containing the terminal.

**Architecture:** The terminal stops being a full-screen hero and becomes the About tab's content. Its state lifts into `App` via a `useTerminal` hook so it survives tab switches. Navigation moves from two duplicated places (taskbar links + horizontal tab strip) into one vertical rail. Tab ids are centralised in `src/lib/tabs.js`. Font sizes are fixed at the Tailwind scale rather than per call site.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, framer-motion 11, react-icons 5, Vitest 2, prop-types

**Spec:** `docs/superpowers/specs/2026-08-20-layout-restructure-design.md`

## Global Constraints

- **NO git commits. NO `git add`.** Do not run any `git` command that writes. The working tree stays dirty; the user commits when they choose. Where a step would normally commit, stop and report instead.
- **Run NO verification commands.** No `npm test`, `npm run lint`, `npm run build`, `npm run dev`, no `npx`, no browser automation. The user runs all verification themselves.
- **Write no new tests.** The user verifies behaviour directly. The single exception is Task 1 Step 4, which repairs an *existing* assertion that this work would otherwise break.
- **Theme is frozen.** Do not change any colour token, font family, `.pf-*` pixel-window rule, `.btn` rule, badge style, ticker, scanline, particle, or the boot screen's visual design. Font *sizes* are in scope; nothing else visual is.
- **No new dependencies.** Do not add to `package.json`.
- **`src/constants/index.js` is untouched.** No content rewrites.
- **Code style:** 4-space indent, double-quoted strings, no semicolons. Match the surrounding file exactly.
- **Every component with props declares `PropTypes`.** The repo lints for this.
- **Motion respects `prefers-reduced-motion`** via the existing `useReducedMotion` hook. Any new animation needs a reduced branch.
- **Lint runs with `--max-warnings 0` and `--report-unused-disable-directives`.** Never write an `eslint-disable` comment for a rule that is not enabled — the unused directive is itself an error.

---

### Task 1: Shared tab ids and resume helper

Centralises the tab list so the places that must agree read from one source, and de-duplicates the resume download that is currently copy-pasted in two components.

**Files:**
- Create: `src/lib/tabs.js`
- Create: `src/lib/resume.js`
- Modify: `src/lib/terminalCommands.js` (whole file)
- Modify: `src/lib/terminalCommands.test.js:2`, `:5`, `:40-42`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `TAB_IDS: string[]` — `["about", "career", "education", "projects", "stack"]`
  - `tabButtonId(id: string): string` — returns `` `tab-${id}` ``
  - `tabPanelId(id: string): string` — returns `` `panel-${id}` ``
  - `downloadResume(): void` — triggers the PDF download
  - `COMMANDS` and `parseCommand` keep their existing signatures; `COMMANDS` grows from 7 to 8 entries.

- [ ] **Step 1: Create `src/lib/tabs.js`**

```js
// Single source of truth for the section ids. ContentPanel (which renders
// the panels), Rail (which renders the nav) and terminalCommands (which
// resolves typed commands to them) all read from here — previously each
// kept its own array, and a mismatch failed silently rather than erroring.
export const TAB_IDS = ["about", "career", "education", "projects", "stack"]

// The tablist lives in Rail and the tabpanel lives in ContentPanel, so the
// ARIA id wiring crosses a component boundary. Building the ids here means
// neither side can drift from the other's naming.
export const tabButtonId = (id) => `tab-${id}`
export const tabPanelId = (id) => `panel-${id}`
```

- [ ] **Step 2: Create `src/lib/resume.js`**

This logic currently exists verbatim in both `Sidebar.jsx:15-20` and `Hero.jsx:102-105`. Extract it once.

```js
// Programmatic download of the resume PDF from /public. Used by the
// taskbar's RESUME button and by the terminal's `resume` command.
export const downloadResume = () => {
    const link = document.createElement("a")
    link.href = "/Aiman_Naim_Resume.pdf"
    link.download = "Aiman_Naim_Resume.pdf"
    link.click()
}
```

- [ ] **Step 3: Rewrite `src/lib/terminalCommands.js` to consume `TAB_IDS`**

Replace the whole file. The only behavioural change is that `about` is now a recognised tab command.

```js
import { TAB_IDS } from "./tabs"

export const COMMANDS = [
    ...TAB_IDS.map((t) => ({ name: t, description: `open the ${t} panel` })),
    { name: "resume", description: "download resume PDF" },
    { name: "clear",  description: "clear the terminal" },
    { name: "help",   description: "list available commands" },
]

export const parseCommand = (input) => {
    const cmd = String(input ?? "").trim().toLowerCase()

    if (TAB_IDS.includes(cmd)) return { type: "tab", payload: cmd }
    if (cmd === "help")     return { type: "help", payload: null }
    if (cmd === "clear")    return { type: "clear", payload: null }
    if (cmd === "resume")   return { type: "resume", payload: null }

    return { type: "unknown", payload: String(input ?? "").trim() }
}
```

- [ ] **Step 4: Repair the two assertions this breaks in `src/lib/terminalCommands.test.js`**

Write no new tests — the user verifies behaviour directly. But two existing
assertions go stale here, and one of them **fails**, so the suite must be
kept honest.

Line 40-42 asserts seven commands. There are now eight. Derive it so it
cannot go stale again, and fix the title, which currently says "has exactly
seven entries":

```js
describe("COMMANDS", () => {
    it("covers every tab plus resume, clear and help", () => {
        expect(COMMANDS.length).toBe(TAB_IDS.length + 3)
    })
```

Line 5 hardcodes the four old ids in an `it.each`. It still passes, but it
silently stops covering `about`. Drive it off `TAB_IDS` too:

```js
    it.each(TAB_IDS)("maps %s to a tab", (id) => {
```

Both need `TAB_IDS` in scope, so add an import beneath the existing one on
line 2:

```js
import { TAB_IDS } from "./tabs"
```

Leave every other test in the file untouched.

- [ ] **Step 5: Report**

Do not commit. Do not run the test suite. Report which files you created and modified, and stop.

---

### Task 2: Type scale

Fixes 37 declarations at or below 12px. The fix lands at the Tailwind scale so most call sites need no edit at all.

`Hero.jsx` and `Sidebar.jsx` also contain small type, but they are **deleted in Task 8** and replaced by `AboutPanel.jsx` (Task 4) and `Rail.jsx` (Task 5), which are written with the new tokens from birth. **Do not edit `Hero.jsx` or `Sidebar.jsx` in this task** — it would be thrown away.

**Files:**
- Modify: `tailwind.config.js:27-31` (add `fontSize` beside `fontFamily`)
- Modify: `src/index.css:81`, `:118`, `:190`
- Modify: `src/components/PixelWindow.jsx:20`
- Modify: `src/components/Education.jsx:19`, `:21`
- Modify: `src/components/ProcessRow.jsx:24`, `:26`
- Modify: `src/components/ProjectModal.jsx:68`, `:123`, `:139`
- Modify: `src/components/Uses.jsx:12`, `:111`

**Interfaces:**
- Consumes: nothing.
- Produces: a `text-label` utility (10px) and redefined `text-xs` (13px), `text-sm` (15px), `text-base` (16px/1.7), `text-lg` (18px). Tasks 4, 5, 6 and 7 use these.

- [ ] **Step 1: Add the font-size scale to `tailwind.config.js`**

Insert a `fontSize` block inside `theme.extend`, immediately after the existing `fontFamily` block (which ends at line 31). Keys placed in `extend` override the matching default keys and leave the rest of the scale intact.

```js
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
```

- [ ] **Step 2: Sweep the arbitrary values in the surviving components**

Each of these is a plain string substitution inside a `className`. Change **only** the size token; leave every other class on the line alone.

| File | Line | From | To |
|---|---|---|---|
| `src/components/PixelWindow.jsx` | 20 | `text-[13px]` | `text-xs` |
| `src/components/Education.jsx` | 19 | `text-[15px]` | `text-sm` |
| `src/components/Education.jsx` | 21 | `text-[13px]` | `text-xs` |
| `src/components/ProcessRow.jsx` | 24 | `text-[15px]` | `text-sm` |
| `src/components/ProcessRow.jsx` | 26 | `text-[11px]` | `text-xs` |
| `src/components/ProjectModal.jsx` | 68 | `text-[13px]` | `text-xs` |
| `src/components/ProjectModal.jsx` | 123 | `text-[9px]` | `text-label` |
| `src/components/ProjectModal.jsx` | 139 | `text-[9px]` | `text-label` |
| `src/components/Uses.jsx` | 12 | `text-[9px]` | `text-label` |
| `src/components/Uses.jsx` | 111 | `text-[13px]` | `text-xs` |

Leave `text-[17px]`, `text-[19px]` and `text-[clamp(16px,3vw,24px)]` alone wherever they appear — those are deliberate headings already above the floor.

Two further `text-[13px]` call sites exist and are **deliberately skipped**: `ContentPanel.jsx:29` (the `TAB_BASE` constant) and `Taskbar.jsx:35` (a nav link). Both lines are deleted outright in Tasks 6 and 7.

- [ ] **Step 3: Fix the three raw `font-size` declarations in `src/index.css`**

These bypass Tailwind entirely, so Step 1 does not reach them.

- Line 81, inside the `.btn` rule — change `font-size: 14px;` to `font-size: 15px;`
- Line 118, inside `.boot-box` — change `font-size: 14px;` to `font-size: 15px;`
- Line 190, inside `.ticker-label` — change `font-size: 12px;` to `font-size: 13px;`

Do not touch line 183 (`.term-line`, already 15px) or line 192 (`.ticker-track span`, already 13px).

- [ ] **Step 4: Report**

Do not commit. Report the files changed and flag one thing for the user to eyeball: Press Start 2P is very wide per character, so labels going 8px → 10px grow ~25%. `WORDS I LIVE BY` and `© 2026 AIMAN NAIM` sit in a 320px rail and may now wrap.

---

### Task 3: `useTerminal` hook

Lifts the terminal's state out of the component so it survives tab switches. Without this, leaving About and coming back would re-type the four-line intro and discard the user's command history.

**No test file.** The user verifies behaviour in the browser. (For the record: this repo runs `vitest run` in Node with no jsdom and no `@testing-library/react`, so a hook could not be rendered in a test even if one were wanted, and adding either would violate the no-new-dependencies constraint.)

**Files:**
- Create: `src/hooks/useTerminal.js`

**Interfaces:**
- Consumes: `parseCommand` and `COMMANDS` from `src/lib/terminalCommands.js`; `downloadResume` from `src/lib/resume.js`; `useReducedMotion` from `src/hooks/useReducedMotion.js`.
- Produces: `useTerminal({ onNavigate, started })` returning
  `{ lines, done, history, draft, setDraft, runCommand }` where
  - `lines: Array<{ prompt: string, result: string | null }>`
  - `done: boolean`
  - `history: Array<{ prompt: string, result: string, error: boolean }>`
  - `draft: string`
  - `setDraft: (value: string) => void`
  - `runCommand: (raw: string) => void`

  Also exports `TERMINAL_LINES`, the scripted intro array.

- [ ] **Step 1: Create `src/hooks/useTerminal.js`**

The scripted-typing effect moves verbatim from `Hero.jsx:48-85`. **Preserve the `cancelled` flag exactly** — it guards React 18 StrictMode's double effect invocation, and dropping it makes the intro double-type.

```js
import { useCallback, useEffect, useState } from "react"
import { parseCommand, COMMANDS } from "../lib/terminalCommands"
import { downloadResume } from "../lib/resume"
import useReducedMotion from "./useReducedMotion"

export const TERMINAL_LINES = [
    { prompt: "$ whoami",         result: "aiman naim — full stack developer" },
    { prompt: "$ role --current", result: "full stack developer @ ernst & young" },
    { prompt: "$ mission",        result: "building compliance platforms for malaysia's ccc" },
    { prompt: "$ status",         result: "open to interesting problems ✓" },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Owns the terminal's entire state. Lives in App rather than in the panel
 * that renders it, because the About panel unmounts on every tab switch —
 * keeping state here means the scripted intro types once per page load
 * (not once per visit to the tab) and the user's command history survives
 * a round trip to Projects and back.
 */
export default function useTerminal({ onNavigate, started = true }) {
    const reduced = useReducedMotion()

    const [lines, setLines] = useState(() => (reduced ? [...TERMINAL_LINES] : []))
    const [done, setDone] = useState(reduced)
    const [history, setHistory] = useState([])
    const [draft, setDraft] = useState("")

    useEffect(() => {
        if (reduced) {
            // Reduced motion can flip on mid-typing. Settle to the fully-typed
            // end state rather than bailing out and stranding partial text.
            setLines([...TERMINAL_LINES])
            setDone(true)
            return undefined
        }

        // BootScreen owns the page until it hands off via `started`. Without
        // this guard the typing races the boot overlay and finishes invisibly
        // behind it.
        if (!started) return undefined

        let cancelled = false

        // Lines 0..n-1 fully settled. Declared inside the effect so it is not
        // a dependency and cannot go stale.
        const settled = (n) => TERMINAL_LINES.slice(0, n).map((l) => ({ ...l }))

        const run = async () => {
            for (let i = 0; i < TERMINAL_LINES.length; i++) {
                const line = TERMINAL_LINES[i]

                for (let c = 1; c <= line.prompt.length; c++) {
                    if (cancelled) return
                    setLines([...settled(i), { prompt: line.prompt.slice(0, c), result: null }])
                    await sleep(24)
                }

                await sleep(160)
                if (cancelled) return
                setLines(settled(i + 1))
                await sleep(280)
            }
            if (!cancelled) setDone(true)
        }

        run()
        return () => { cancelled = true }
    }, [reduced, started])

    // Memoised because AboutPanel lists setDraft in an effect's deps; an
    // unstable identity there would clear the draft on every render.
    const runCommand = useCallback((raw) => {
        const { type, payload } = parseCommand(raw)
        const entry = { prompt: `$ ${raw}`, result: null, error: false }

        if (type === "tab") {
            entry.result = `opening ~/${payload}...`
            onNavigate(payload)
        } else if (type === "help") {
            entry.result = COMMANDS.map((c) => `${c.name.padEnd(10)} ${c.description}`).join("\n")
        } else if (type === "clear") {
            setHistory([])
            setDraft("")
            return
        } else if (type === "resume") {
            entry.result = "downloading Aiman_Naim_Resume.pdf..."
            downloadResume()
        } else {
            entry.error = true
            entry.result = `command not found: ${payload || "(empty)"}`
        }

        setHistory((h) => [...h, entry])
        setDraft("")
    }, [onNavigate])

    return { lines, done, history, draft, setDraft, runCommand }
}
```

`setDraft` comes straight from `useState`, so React already guarantees a stable identity for it — no memoisation needed there.

- [ ] **Step 2: Report**

Do not commit. Report the file created, and confirm the `cancelled` guard survived the move.

---

### Task 4: `AboutPanel` component

The terminal, no longer a hero. Same markup, same behaviour, but presentational — state arrives as props from `useTerminal` — and it now carries `ABOUT_TEXT` beneath it.

`Hero.jsx` is **left in place** this task so the app keeps building; Task 8 deletes it.

**Files:**
- Create: `src/components/AboutPanel.jsx`

**Interfaces:**
- Consumes: `PixelWindow`; `useMediaQuery` from `src/hooks/useMediaQuery.js`; `COMMANDS` from `src/lib/terminalCommands.js`; `ABOUT_TEXT` from `src/constants`; the `useTerminal` return shape from Task 3.
- Produces: default export `AboutPanel` with props
  `{ lines, done, history, draft, setDraft, runCommand, windowRef }`.

- [ ] **Step 1: Create `src/components/AboutPanel.jsx`**

Adapted from `Hero.jsx`. Four differences from the original, all deliberate:

1. No `<section className="min-h-[92vh] ...">` wrapper — it is panel content now, not a screen.
2. No `▶ VIEW_CAREER` / `📁 VIEW_PROJECTS` buttons — the rail is always visible, so they are redundant discoverability.
3. `ABOUT_TEXT` renders below the terminal.
4. All state is props; the component holds only `isDesktop`.

```jsx
import { useEffect } from "react"
import PropTypes from "prop-types"
import PixelWindow from "./PixelWindow"
import useMediaQuery from "../hooks/useMediaQuery"
import { COMMANDS } from "../lib/terminalCommands"
import { ABOUT_TEXT } from "../constants"

// 900px covers iPad portrait and landscape phones. Below it the text input
// is truly absent from the DOM (not merely CSS-hidden), so tapping cannot
// summon the OS keyboard over the content.
const DESKTOP_QUERY = "(min-width: 900px)"

const AboutPanel = ({ lines, done, history, draft, setDraft, runCommand, windowRef }) => {
    const isDesktop = useMediaQuery(DESKTOP_QUERY)

    // Text typed before narrowing the viewport would otherwise persist in
    // state with no visible field, and reappear if the viewport widens.
    useEffect(() => {
        setDraft("")
    }, [isDesktop, setDraft])

    return (
        <div className="flex flex-col gap-6">
            <div ref={windowRef}>
                <PixelWindow size="lg" glow title="aiman@root: ~/about">
                    <div className="px-5 py-6 sm:px-6 text-left min-h-[220px]">
                        <div className="font-pixel text-[clamp(16px,3vw,24px)] text-term-text mb-1.5">
                            AIMAN NAIM
                        </div>
                        <div className="font-mono text-sm text-acc-purple mb-5 tracking-[0.04em]">
                            {"// full stack software engineer"}
                        </div>

                        {/*
                            role="group" is required for aria-label to apply — a bare
                            <div> is generic and accessible-name computation forbids
                            naming it, which would make the label inert.

                            The scripted lines are NOT in an aria-live region: that
                            would narrate the terminal character-by-character as it
                            types. Only the user's command history is live.
                        */}
                        <div role="group" aria-label="terminal output">
                            {lines.map((line, i) => (
                                // Array index is a safe key: append-only, fixed-length,
                                // never reordered, inserted, or removed.
                                <div key={i}>
                                    <div className="term-line"><span className="term-prompt">{line.prompt}</span></div>
                                    {line.result && <div className="term-line term-result">{line.result}</div>}
                                </div>
                            ))}

                            {done && (
                                <div className="term-line term-result">
                                    {"type 'help' for commands"}
                                </div>
                            )}

                            <div aria-live="polite">
                                {history.map((entry, i) => (
                                    // Same append-only rationale; clear() replaces the
                                    // whole array so indices never point at stale entries.
                                    <div key={i}>
                                        <div className="term-line"><span className="term-prompt">{entry.prompt}</span></div>
                                        {entry.result && (
                                            <div
                                                className={`whitespace-pre-wrap ${entry.error ? "term-line term-error" : "term-line term-result"}`}
                                            >
                                                {entry.result}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {done && (isDesktop ? (
                            <form
                                onSubmit={(e) => { e.preventDefault(); runCommand(draft) }}
                                className="term-line flex items-center"
                            >
                                <label htmlFor="term-input" className="term-prompt">$&nbsp;</label>
                                <input
                                    id="term-input"
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    autoComplete="off"
                                    spellCheck="false"
                                    aria-label="Terminal command input"
                                    className="flex-1 bg-transparent border-0 outline-none font-mono text-sm text-term-text caret-acc-green"
                                />
                            </form>
                        ) : (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {COMMANDS.map((c) => (
                                    <button
                                        key={c.name}
                                        type="button"
                                        onClick={() => runCommand(c.name)}
                                        className="font-mono text-xs px-2.5 py-1.5 bg-term-panel2 border-2 border-term-outline text-acc-green"
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </PixelWindow>
            </div>

            <p className="font-sans text-base text-term-muted">{ABOUT_TEXT}</p>
        </div>
    )
}

AboutPanel.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.shape({
        prompt: PropTypes.string.isRequired,
        result: PropTypes.string,
    })).isRequired,
    done: PropTypes.bool.isRequired,
    history: PropTypes.arrayOf(PropTypes.shape({
        prompt: PropTypes.string.isRequired,
        result: PropTypes.string,
        error: PropTypes.bool,
    })).isRequired,
    draft: PropTypes.string.isRequired,
    setDraft: PropTypes.func.isRequired,
    runCommand: PropTypes.func.isRequired,
    // Ref to the terminal's PixelWindow wrapper, exposed so BootScreen can
    // measure it as the FLIP morph target.
    windowRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any }),
    ]),
}

export default AboutPanel
```

- [ ] **Step 2: Verify `ABOUT_TEXT` is exported under that exact name**

Run `grep -n "ABOUT_TEXT" src/constants/index.js` and confirm. `Intro.jsx:1` imports it as a named export from `"../constants"`, so it should be. If the name differs, use the real one and report the discrepancy.

- [ ] **Step 3: Report**

Do not commit. Note that `Hero.jsx` still exists and is still what `App.jsx` renders — that is expected until Task 8.

---

### Task 5: `Rail` component with vertical navigation

The identity card gains the site's navigation and loses the social grid (which moves to the taskbar in Task 7).

`Sidebar.jsx` is **left in place** this task; Task 8 deletes it.

**Files:**
- Create: `src/components/Rail.jsx`

**Interfaces:**
- Consumes: `TAB_IDS`, `tabButtonId`, `tabPanelId` from `src/lib/tabs.js`; `PixelWindow`; `useTypewriter`; `useReducedMotion`; `liveAge` from `src/lib/clock.js`; `src/assets/aiman.jpg`.
- Produces: default export `Rail` with props `{ active, onTabChange }` — the same two props `ContentPanel` takes today.

**Two deliberate departures from `Sidebar.jsx`, decided before this task was dispatched. Do not "fix" them back:**

1. **Three sibling blocks, not one window.** `Sidebar` was a single `PixelWindow`. `Rail` renders three: an identity window, a `nav.sys` window holding the tablist, and a plain quote/credits block. This is what makes Task 9's mobile layout possible — a sticky element is confined to its parent's box, so a nav nested inside the identity window could never stay on screen once that window scrolled away.
2. **No entrance animation.** `Sidebar` faded and slid in via `motion.aside`. `Rail` is a plain `<aside>`. Task 9 gives the aside `display: contents` on mobile, which generates no box and makes transforms inert — so the animation would run on desktop and silently die on mobile. An entrance animation on the site's primary navigation is not worth that inconsistency. Do not import `framer-motion` here.

- [ ] **Step 1: Create `src/components/Rail.jsx`**

```jsx
import { useRef } from "react"
import PropTypes from "prop-types"
import PixelWindow from "./PixelWindow"
import useTypewriter from "../hooks/useTypewriter"
import useReducedMotion from "../hooks/useReducedMotion"
import { liveAge } from "../lib/clock"
import { TAB_IDS, tabButtonId, tabPanelId } from "../lib/tabs"
import logo from "../assets/aiman.jpg"

const ROLE_WORDS = [
    "Full Stack Developer", "Front End Developer", "Back End Developer",
    "Coder", "Programmer", "Software Engineer", "Tech Enthusiast",
]

// Must cover every id in TAB_IDS. Render order comes from TAB_IDS, not from
// this object, so the rail and the panel can never disagree.
const NAV_META = {
    about:     { emoji: "👤", label: "ABOUT" },
    career:    { emoji: "💼", label: "CAREER" },
    education: { emoji: "🎓", label: "EDUCATION" },
    projects:  { emoji: "📁", label: "PROJECTS" },
    stack:     { emoji: "🛠", label: "STACK" },
}

const NAV_BASE =
    "w-full font-mono text-xs px-3 py-2.5 border-2 border-term-outline shadow-[2px_2px_0_#000] flex items-center gap-2.5 text-left transition-colors"

const Rail = ({ active, onTabChange }) => {
    const reduced = useReducedMotion()
    const btnRefs = useRef({})

    const role = useTypewriter({ words: ROLE_WORDS, loop: true, enabled: !reduced })

    const handleKeyDown = (event, index) => {
        let nextIndex = null

        // Vertical orientation: Up/Down, not the Left/Right the old
        // horizontal tab strip used.
        if (event.key === "ArrowDown") nextIndex = (index + 1) % TAB_IDS.length
        else if (event.key === "ArrowUp") nextIndex = (index - 1 + TAB_IDS.length) % TAB_IDS.length
        else if (event.key === "Home") nextIndex = 0
        else if (event.key === "End") nextIndex = TAB_IDS.length - 1
        else return

        event.preventDefault()
        const nextId = TAB_IDS[nextIndex]
        onTabChange(nextId)
        btnRefs.current[nextId]?.focus()
    }

    return (
        <aside className="w-full lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-[var(--rail-top)] lg:self-start flex flex-col gap-5">
            {/* Block 1 — identity */}
            <PixelWindow title="profile.dat" className="w-full" innerClassName="p-4 sm:p-5 flex flex-col gap-5">
                <div className="relative mx-auto w-32 h-32">
                    <img
                        src={logo}
                        alt="Aiman Naim"
                        className="w-32 h-32 object-cover border-2 border-black"
                    />
                    <span className="absolute bottom-[-6px] right-[-6px] font-pixel text-label bg-acc-green text-[#1e1f29] border-2 border-term-outline px-1.5 py-0.5 leading-none">
                        LV.{liveAge()}
                    </span>
                </div>

                <div className="text-center flex flex-col gap-1.5">
                    <h1 className="font-pixel text-[19px] text-term-text tracking-wider leading-relaxed">AIMAN NAIM</h1>
                    <p className="font-mono text-xs text-term-muted">
                        Kuala Lumpur <span className="text-acc-purple">·</span> Age {liveAge()}
                    </p>
                    <p className="font-mono text-sm text-acc-purple mt-1">
                        <span className="text-term-muted">[ </span>
                        <span>{role}</span>
                        <span className="term-cursor" aria-hidden="true" />
                        <span className="text-term-muted"> ]</span>
                    </p>
                </div>
            </PixelWindow>

            {/* Block 2 — the site's only navigation. Its own window so Task 9
                can make it sticky on mobile; nested inside the identity card
                it would be confined to that card's box and scroll away. */}
            <PixelWindow title="nav.sys" className="w-full" innerClassName="p-3">
                <nav
                    role="tablist"
                    aria-label="content sections"
                    aria-orientation="vertical"
                    className="flex flex-col gap-2"
                >
                    {TAB_IDS.map((id, index) => {
                        const { emoji, label } = NAV_META[id]
                        const isActive = id === active
                        return (
                            <button
                                key={id}
                                ref={(el) => {
                                    btnRefs.current[id] = el
                                }}
                                type="button"
                                role="tab"
                                id={tabButtonId(id)}
                                aria-selected={isActive}
                                aria-controls={isActive ? tabPanelId(id) : undefined}
                                tabIndex={isActive ? 0 : -1}
                                onClick={() => onTabChange(id)}
                                onKeyDown={(event) => handleKeyDown(event, index)}
                                className={`${NAV_BASE} ${isActive ? "bg-acc-green text-[#1e1f29]" : "bg-term-panel2 text-term-muted hover:text-acc-green"}`}
                            >
                                {/* Kept in the layout when inactive so labels don't shift. */}
                                <span className={isActive ? "" : "opacity-0"} aria-hidden="true">►</span>
                                <span aria-hidden="true">{emoji}</span>
                                <span>{label}</span>
                            </button>
                        )
                    })}
                </nav>
            </PixelWindow>

            {/* Block 3 — quote + credits. No window: the quote carries its own
                surface and the credits sit on the page background. */}
            <div className="w-full flex flex-col gap-5">
                <div className="border-l-[3px] border-acc-purple bg-term-panel2 px-3.5 py-3">
                    <p className="font-pixel text-label text-acc-purple mb-2">WORDS I LIVE BY</p>
                    <p className="font-sans text-sm italic text-term-text leading-relaxed">
                        “So surely with hardships comes ease”
                    </p>
                    <p className="font-mono text-xs text-term-muted mt-2">— Surah Ash-Sharh, Ayat 5</p>
                </div>

                <div className="flex flex-col items-center gap-1 text-center">
                    <p className="font-mono text-xs text-term-muted">Built with React, Tailwind & Vite — pixel/terminal edition</p>
                    <p className="font-pixel text-label text-term-muted">© {new Date().getFullYear()} AIMAN NAIM</p>
                </div>
            </div>
        </aside>
    )
}

Rail.propTypes = {
    active: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
}

export default Rail
```

Three details worth noticing rather than "fixing":

- `text-label` already carries `letterSpacing: 0.08em`, so `Sidebar`'s `tracking-widest` on the quote heading and the copyright line is dropped — keeping both would double the tracking.
- `Sidebar`'s credits block had `border-t border-white/10` to divide it from the quote inside a shared window. Outside one that becomes a stray hairline, so it is gone.
- `--rail-top` is defined in Task 8. Until then the sticky offset resolves to nothing and the rail is not sticky. That is expected.

- [ ] **Step 2: Report**

Do not commit. Do not run any verification command. Note that `Sidebar.jsx` still exists and is still what `App.jsx` renders.

---

### Task 6: `ContentPanel` — drop the tab strip, add the About tab

The panel stops owning navigation and becomes pure window chrome plus the active section.

**Files:**
- Modify: `src/components/ContentPanel.jsx` (whole file)

**Interfaces:**
- Consumes: `TAB_IDS`, `tabButtonId`, `tabPanelId` from Task 1; `AboutPanel` from Task 4.
- Produces: default export `ContentPanel` with props `{ active, terminal }`.
  `terminal` is the whole `useTerminal` return object plus `windowRef`; it is
  spread into `AboutPanel` and ignored by every other tab.

- [ ] **Step 1: Rewrite `src/components/ContentPanel.jsx`**

The horizontal tablist, the `btnRefs`, `focusTabAt`, `handleKeyDown` and the `onTabChange` prop all move to `Rail` and are deleted here. `AnimatePresence`, `PixelWindow`, the per-tab titles, and the `role="tabpanel"` wrapper all stay.

```jsx
import PropTypes from "prop-types"
import { motion, AnimatePresence } from "framer-motion"
import PixelWindow from "./PixelWindow"
import AboutPanel from "./AboutPanel"
import CareerSection from "./CareerSection"
import Education from "./Education"
import Projects from "./Projects"
import Uses from "./Uses"
import useReducedMotion from "../hooks/useReducedMotion"
import { TAB_IDS, tabButtonId, tabPanelId } from "../lib/tabs"

// Keyed by id so it cannot drift out of order with TAB_IDS, which is the
// single source of truth for both membership and order. The tech-stack id
// is "stack", not "uses".
const COMPONENTS = {
    about:     AboutPanel,
    career:    CareerSection,
    education: Education,
    projects:  Projects,
    stack:     Uses,
}

const TITLES = {
    about:     "aiman@root: ~/about",
    career:    "aiman@root: ~/career.log",
    education: "aiman@root: ~/education.log",
    projects:  "aiman@root: ~/projects",
    stack:     "aiman@root: ~/stack.log",
}

const ContentPanel = ({ active, terminal }) => {
    const reduced = useReducedMotion()

    const activeId = TAB_IDS.includes(active) ? active : TAB_IDS[0]
    const ActiveComponent = COMPONENTS[activeId]

    // Only the About tab renders the terminal, so only it receives the
    // lifted terminal state. Every other section takes no props.
    const activeProps = activeId === "about" ? terminal : {}

    return (
        <div className="flex-1 min-w-0 w-full">
            <PixelWindow title={TITLES[activeId]} className="w-full">
                <div
                    role="tabpanel"
                    id={tabPanelId(activeId)}
                    aria-labelledby={tabButtonId(activeId)}
                    className="p-4 sm:p-6"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeId}
                            initial={reduced ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                            transition={{ duration: reduced ? 0 : 0.2 }}
                        >
                            <ActiveComponent {...activeProps} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </PixelWindow>
        </div>
    )
}

ContentPanel.propTypes = {
    active: PropTypes.string.isRequired,
    // The full useTerminal() return plus windowRef. Spread into AboutPanel.
    terminal: PropTypes.object.isRequired,
}

export default ContentPanel
```

- [ ] **Step 2: Report**

Do not commit. Flag that navigation is temporarily unreachable by mouse — the tab strip is gone and `App.jsx` does not yet render `Rail`. Task 8 closes that gap.

---

### Task 7: `Taskbar` — socials in, nav links out

**Files:**
- Modify: `src/components/Taskbar.jsx` (whole file)

**Interfaces:**
- Consumes: `downloadResume` from `src/lib/resume.js`; `formatClock` from `src/lib/clock.js`; icons from `react-icons/fa6`.
- Produces: default export `Taskbar` with **no props**. The `onNavigate` prop is removed — `App.jsx` must stop passing it in Task 8.

- [ ] **Step 1: Rewrite `src/components/Taskbar.jsx`**

The `NAV` array and its `<nav>` are deleted; the rail owns navigation now. Five icon-only social links and a filled Resume button take their place.

Discord copies a username and previously confirmed by swapping its label to `COPIED`. As a bare icon there is no label to swap, so the icon flashes green and a visually-hidden `role="status"` region announces the result.

```jsx
import { useEffect, useState } from "react"
import { FaLinkedin, FaGithub, FaInstagram, FaThreads, FaDiscord, FaFilePdf } from "react-icons/fa6"
import { formatClock } from "../lib/clock"
import { downloadResume } from "../lib/resume"
import useReducedMotion from "../hooks/useReducedMotion"

const SOCIALS = [
    { Icon: FaLinkedin,  href: "https://www.linkedin.com/in/aimannaimfaizul/", title: "LinkedIn" },
    { Icon: FaGithub,    href: "https://github.com/aimxnaim",                  title: "GitHub" },
    { Icon: FaInstagram, href: "https://www.instagram.com/aimxnaim/",          title: "Instagram" },
    { Icon: FaThreads,   href: "https://www.threads.com/@aimxnaim",            title: "Threads" },
]

const ICON_CLASS =
    "p-1.5 text-term-muted hover:text-acc-green transition-colors"

const Taskbar = () => {
    const [now, setNow] = useState(() => formatClock(new Date()))
    const [copied, setCopied] = useState(false)
    const reduced = useReducedMotion()

    useEffect(() => {
        const id = setInterval(() => setNow(formatClock(new Date())), 1000)
        return () => clearInterval(id)
    }, [])

    const copyDiscord = async () => {
        try {
            await navigator.clipboard.writeText("mxxn512")
        } catch {
            // Clipboard can reject on insecure origins or a denied permission.
            // The confirmation still fires: the username is in the tooltip, so
            // the user has a manual fallback either way.
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-[70]">
            <div className="taskbar">
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
                    className="font-mono text-sm font-bold text-term-text flex-shrink-0"
                >
                    aiman<span className="text-acc-green">@system</span>
                </button>

                <div className="flex items-center gap-0.5 sm:gap-1">
                    {SOCIALS.map(({ Icon, href, title }) => (
                        <a
                            key={title}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            title={title}
                            aria-label={title}
                            className={ICON_CLASS}
                        >
                            <Icon className="text-lg" />
                        </a>
                    ))}

                    <button
                        type="button"
                        onClick={copyDiscord}
                        title="Copy Discord username (mxxn512)"
                        aria-label="Copy Discord username"
                        className={`${ICON_CLASS} ${copied ? "text-acc-green" : ""}`}
                    >
                        <FaDiscord className="text-lg" />
                    </button>

                    <span className="sr-only" role="status">
                        {copied ? "Discord username copied" : ""}
                    </span>

                    <button
                        type="button"
                        onClick={downloadResume}
                        title="Download Resume"
                        className="ml-1.5 sm:ml-2.5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1.5 bg-acc-green text-[#1e1f29] border-2 border-term-outline shadow-[2px_2px_0_#000] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_#000] transition-transform"
                    >
                        <FaFilePdf aria-hidden="true" />
                        RESUME
                    </button>
                </div>

                {/* Logo + 5 icons + RESUME already fill a 375px bar, so the
                    clock and status dot drop out below sm. Both are
                    decorative and the phone shows its own clock. */}
                <div className="hidden sm:flex items-center gap-3.5 font-mono text-xs text-term-muted flex-shrink-0">
                    <span className="status-dot" aria-hidden="true" />
                    <span>ONLINE</span>
                    <span>{now}</span>
                </div>
            </div>
        </header>
    )
}

export default Taskbar
```

- [ ] **Step 2: Confirm `sr-only` is available**

Tailwind ships `sr-only` as a core utility, so no config change is needed. Run `grep -rn "sr-only" src/` to see whether the codebase already uses it. If it appears nowhere and you have any doubt, add an explicit rule to `src/index.css` rather than removing the announcement:

```css
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
```

- [ ] **Step 3: Report**

Do not commit. Note that `Taskbar` no longer accepts `onNavigate`, so `App.jsx:40` is now passing a prop that is ignored — Task 8 removes it.

---

### Task 8: The pivot — new `App` shell, chrome offsets, and cleanup

Swaps the layout atomically and deletes the three replaced components.

**Files:**
- Modify: `src/App.jsx` (whole file)
- Modify: `src/index.css:20-22` (the `scroll-padding-top` rule and its comment)
- Modify: `src/components/BootScreen.jsx:7` (one string)
- Delete: `src/components/Hero.jsx`
- Delete: `src/components/Sidebar.jsx`
- Delete: `src/components/Intro.jsx`

**Interfaces:**
- Consumes: everything from Tasks 1–7.
- Produces: the finished layout.

- [ ] **Step 1: Confirm nothing still imports the three doomed files**

```bash
grep -rn "Hero\|Sidebar\|Intro" src/ --include="*.jsx" --include="*.js"
```

Quote the `--include` patterns exactly as written — unquoted, zsh expands them against the current directory and the command errors out, which can look like a clean result.

Expect **import** matches only in `src/App.jsx`. You will also get non-import
noise you should ignore: `BootScreen.jsx` uses a `heroRef` prop name and
mentions "hero" in comments (both intentional and unchanged), and the three
doomed files match themselves. If any *other* file imports them, stop and
report rather than deleting.

- [ ] **Step 2: Define the chrome offset in `src/index.css`**

Replace lines 20–22 (the comment and the `scroll-padding-top` rule) with:

```css
/* Only the taskbar is fixed; the ticker scrolls away with the page. One
   offset to manage, defined once and consumed by the shell's padding, by
   scroll anchoring, and by the rail's sticky top. */
:root { --taskbar-h: 56px; --rail-top: 72px; }
html { scroll-padding-top: var(--taskbar-h); }
```

`56px` is an estimate: the taskbar is `10px` padding top and bottom plus a `3px` bottom border, and its tallest child is now the RESUME button (`1.5` = 6px padding top and bottom, `2px` border, 13px text). Report this as a number for the user to check in the browser and adjust — the layout does not break if it is a few pixels off, it just leaves a small gap or overlap.

- [ ] **Step 3: Rewrite `src/App.jsx`**

```jsx
import { useCallback, useEffect, useRef, useState } from "react"
import { Analytics } from "@vercel/analytics/react"
import Backdrop from "./components/Backdrop"
import ScrollProgress from "./components/ScrollProgress"
import Taskbar from "./components/Taskbar"
import Ticker from "./components/Ticker"
import Rail from "./components/Rail"
import ContentPanel from "./components/ContentPanel"
import BootScreen from "./components/BootScreen"
import useReducedMotion from "./hooks/useReducedMotion"
import useTerminal from "./hooks/useTerminal"
import { TAB_IDS } from "./lib/tabs"

function App() {
    const [activeTab, setActiveTab] = useState(TAB_IDS[0])
    // Session-scoped: boot plays once per tab, not once per visit. A fresh
    // tab to the same URL re-plays it; a reload within the same tab does not.
    const [booted, setBooted] = useState(() => sessionStorage.getItem("boot-complete") === "1")
    // Shared with BootScreen so it can measure the About terminal's
    // on-screen rect for the FLIP morph target.
    const terminalWindowRef = useRef(null)
    const reduced = useReducedMotion()

    useEffect(() => {
        document.body.classList.add("term-theme")
        return () => document.body.classList.remove("term-theme")
    }, [])

    // Switching from a scrolled position in Projects to a short tab would
    // otherwise land the viewer below the content, so every switch returns
    // to the top. There is no longer anything to scroll *down* to — the
    // rail keeps navigation on screen at all times.
    const goToTab = useCallback((id) => {
        setActiveTab(id)
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
    }, [reduced])

    const terminal = useTerminal({ onNavigate: goToTab, started: booted })

    const handleBootFinish = useCallback(() => setBooted(true), [])

    return (
        <div className="overflow-x-hidden antialiased selection:bg-acc-green/20 selection:text-acc-green">
            <ScrollProgress />
            <Backdrop />
            <Taskbar />
            {!booted && <BootScreen heroRef={terminalWindowRef} onFinish={handleBootFinish} />}

            {/* Clears the fixed taskbar. The ticker sits in normal flow
                directly beneath it and is allowed to scroll away. */}
            <div className="pt-[var(--taskbar-h)]">
                <Ticker />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                        <Rail active={activeTab} onTabChange={goToTab} />
                        <ContentPanel
                            active={activeTab}
                            terminal={{ ...terminal, windowRef: terminalWindowRef }}
                        />
                    </div>
                    <Analytics />
                </div>
            </div>
        </div>
    )
}

export default App
```

- [ ] **Step 4: Add `/about` to the boot screen's mount line**

`src/components/BootScreen.jsx:7` lists the mounted sections and is now one short. Change:

```js
    { text: "[ 0.1840 ] mounting /career /education /projects /stack ... OK" },
```

to:

```js
    { text: "[ 0.1840 ] mounting /about /career /education /projects /stack ... OK" },
```

Nothing else in `BootScreen.jsx` changes. Its `heroRef` prop name stays as-is — `App` now passes the About terminal's ref into it, and the FLIP maths, the `MIN_STABLE_SCALE` / `MAX_STABLE_SCALE` guards, and the cross-fade fallback all work unchanged against the new, smaller target rect.

- [ ] **Step 5: Delete the three replaced components**

```bash
rm src/components/Hero.jsx src/components/Sidebar.jsx src/components/Intro.jsx
```

Do not `git rm` — no git commands that write.

- [ ] **Step 6: Report**

Do not commit. Report the deletions and the `--taskbar-h` / `--rail-top` estimates so the user can check them against the real rendered height.

---

### Task 9: Mobile stacking

Below `lg` the rail's three blocks stack around the panel: identity above it, navigation above it and sticky, quote and credits below it. Task 5 already built the three-block structure; this task only adds the ordering and sticky classes.

**Files:**
- Modify: `src/components/Rail.jsx` — four `className` strings
- Modify: `src/App.jsx` — wrap `ContentPanel` to give it an order

**Interfaces:**
- Consumes: `Rail` from Task 5, `App` from Task 8. No interface changes.

- [ ] **Step 1: Make the `<aside>` boxless below `lg`**

In `src/components/Rail.jsx`, change the `<aside>`'s className from:

```
w-full lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-[var(--rail-top)] lg:self-start flex flex-col gap-5
```

to:

```
contents lg:flex lg:flex-col lg:gap-5 lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-[var(--rail-top)] lg:self-start
```

`display: contents` is what makes the whole task work: below `lg` the aside generates no box at all, so its three children become direct flex items of `App`'s column and can be interleaved with the panel by `order`. At `lg` it becomes a normal flex column again.

This is also why Task 5 built `Rail` without `framer-motion` — transforms and opacity are inert on a `display: contents` element, so an entrance animation here would run on desktop and silently do nothing on mobile.

- [ ] **Step 2: Order the three blocks**

Each block needs an order below `lg` and none at `lg`. Add to each existing className:

| Block | Element | Add |
|---|---|---|
| Identity | `<PixelWindow title="profile.dat" className="w-full" …>` | `order-1 lg:order-none` |
| Navigation | `<PixelWindow title="nav.sys" className="w-full" …>` | `order-2 lg:order-none` |
| Quote + credits | `<div className="w-full flex flex-col gap-5">` | `order-4 lg:order-none` |

So `className="w-full order-1 lg:order-none"` and so on. The panel takes `order-3` in Step 4.

Below `lg` the three blocks also need their own vertical spacing, since the aside's `gap-5` no longer applies once it is boxless — `App`'s column gap covers this, so add nothing.

- [ ] **Step 3: Make the nav window sticky on mobile**

The navigation block is now a top-level flex item, so sticky positions it against the page rather than against the identity card. Change its className to:

```
w-full order-2 lg:order-none sticky top-[var(--taskbar-h)] z-20 lg:static
```

`z-20` keeps it above the scrolling panel content. It sits below the taskbar's `z-[70]`, so the taskbar still wins.

`PixelWindow` gives this block an opaque background already, so no extra background class is needed — verify that visually and add `bg-term-bg` to the outer element only if panel content shows through.

- [ ] **Step 4: Give the panel its order in `src/App.jsx`**

`ContentPanel` must sit between the nav and the quote on mobile. Wrap it:

```jsx
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                        <Rail active={activeTab} onTabChange={goToTab} />
                        <div className="w-full min-w-0 order-3 lg:order-none lg:flex-1">
                            <ContentPanel
                                active={activeTab}
                                terminal={{ ...terminal, windowRef: terminalWindowRef }}
                            />
                        </div>
                    </div>
```

- [ ] **Step 5: Report**

Do not commit. Do not run any verification command. Say explicitly that this task is the most likely to need visual adjustment, and list the three breakpoints for the user to check: 375px, 768px, 1280px.

---

## Verification (user-run)

The implementer runs none of this. Hand it to the user at the end.

```bash
npm test
npm run lint
npm run build
npm run dev
```

Then in the browser:

- **The core fix:** at 1280px, all five section names are visible without scrolling
- Every rail item switches the panel; `about`, `career`, `education`, `projects`, `stack`, `help`, `clear`, `resume` all work from the terminal
- Terminal history and the scripted intro survive About → Projects → About (the intro must not re-type)
- Rail nav responds to Up/Down/Home/End with focus following selection
- Boot morph lands on the About terminal with no visible jump, and skips on a second load in the same tab
- Discord icon flashes green on click; the username is on the clipboard
- Taskbar does not overflow at 375px
- Rail nav is reachable on mobile while a long panel is scrolled
- No Press Start 2P label wraps unintentionally at 10px — check `WORDS I LIVE BY` and the copyright line
- `--taskbar-h: 56px` matches the real rendered taskbar height
- Projects modal still opens above the scanlines
