# Terminal/OS Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the gold/RPG portfolio theme with a Dracula-palette terminal-OS design, ported from a vanilla HTML mockup to React components on the existing Vite + Tailwind stack.

**Architecture:** The new theme lands *additively* — new Tailwind tokens and pixel-window CSS primitives are added alongside the existing gold/RPG ones, so the site keeps rendering while components are converted one at a time. New chrome (boot screen, taskbar, hero terminal, ticker) is built first, then existing components are restyled, then the dead gold/RPG theme layer is deleted in a final cleanup task. Content stays driven by `src/constants/index.js` throughout.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, framer-motion 11, react-icons 5, Vitest (added in Task 1)

**Spec:** `docs/superpowers/specs/2026-08-19-terminal-os-redesign-design.md`

**Reference mockup:** `docs/reference-design.html` (1165 lines). Lines 407 and 423 are base64 blobs (avatar JPEG, resume PDF) — skip them when reading; use `cut -c1-400` to avoid flooding context.

## Global Constraints

- **Palette is Dracula, exact values:** bg `#282a36`, panel `#2d2f3d`, panel2 `#44475a`, outline `#000000`, text `#f8f8f2`, muted `#9aa5ce`, green `#50fa7b`, purple `#bd93f9`, cyan `#8be9fd`, pink `#ff79c6`, orange `#ffb86c`, red `#ff5555`.
- **Three fonts only:** Press Start 2P (headings/eyebrows/labels), JetBrains Mono (all UI chrome), Space Grotesk (prose). `VT323` and `Inter` are removed by Task 16.
- **Every window surface** uses `.pf-outer` / `.pf-inner` with notched `clip-path` corners. Every button/chip uses `3px solid #000` (or `2px` for small chips) plus a hard offset shadow. No rounded corners, no blurred shadows.
- **Only the hero terminal gets an animated glow.** All other `.pf-outer` use a static `box-shadow`, never `filter: drop-shadow()`. (Reference applies drop-shadow everywhere; that is a deliberate deviation — see spec.)
- **`prefers-reduced-motion: reduce` must disable:** boot sequence, all typewriters, both marquees, particles, hero glow, scroll-reveal transforms, smooth scrolling.
- **Decorative elements** (particles, scanlines, ticker, traffic-light dots) get `aria-hidden="true"`.
- **The easter-egg game is OUT OF SCOPE.** Do not port the `#game` section, the JS at reference lines 1010–1160, or the `.game-*` / `.char-*` / `#gameCanvas` CSS.
- **Assets come from files, not base64:** `src/assets/aiman.jpg`, `public/Aiman_Naim_Resume.pdf`.
- **`src/hooks/useCodeStats.js` must not be modified.** It already returns exactly what the stack tab needs.
- **Lint gate (amended, ruling T1-1):** `npm run lint` runs with `--max-warnings 0`, but the branch does **not** start clean — `src/components/Projects.jsx` carries 19 pre-existing `react/prop-types` errors inherited from `main`. The gate is therefore: **introduce no NEW lint errors.** Verify by comparing the error count and file list against the previous task, not by expecting exit code 0. Task 13 rewrites `Projects.jsx` around `ProcessRow` (which declares propTypes), which should clear the debt; Task 16 verifies lint exits clean at that point.

## Tailwind token naming

The spec lists palette roles; these are the Tailwind names to use:

| Spec role | Tailwind class fragment |
|---|---|
| bg | `term-bg` |
| panel | `term-panel` |
| panel2 | `term-panel2` |
| outline | `term-outline` |
| text | `term-text` |
| muted | `term-muted` |
| green / purple / cyan / pink / orange / red | `acc-green`, `acc-purple`, `acc-cyan`, `acc-pink`, `acc-orange`, `acc-red` |

So: `bg-term-bg`, `text-acc-green`, `border-term-outline`.

## File Structure

| File | Responsibility |
|---|---|
| `tailwind.config.js` | palette + font family tokens |
| `index.html` | Google Fonts links |
| `src/index.css` | pixel-window primitives, global overlays, keyframes |
| `src/lib/pid.js` | `pidFor` — derives decorative PID strings |
| `src/lib/terminalCommands.js` | `parseCommand` — maps typed input to an action |
| `src/lib/clock.js` | `formatClock`, `liveAge` |
| `src/hooks/useReducedMotion.js` | reactive `prefers-reduced-motion` boolean |
| `src/hooks/useTypewriter.js` | character-by-character typing driver |
| `src/hooks/useCodeStats.js` | **unchanged** |
| `src/components/Backdrop.jsx` | grid + scanlines + particles |
| `src/components/ScrollProgress.jsx` | striped scroll bar |
| `src/components/Taskbar.jsx` | logo, nav, ONLINE dot, clock |
| `src/components/PixelWindow.jsx` | shared `.pf-outer`/`.pf-inner`/`.win-bar` wrapper |
| `src/components/Hero.jsx` | terminal + live prompt + CTA buttons |
| `src/components/BootScreen.jsx` | kernel lines, morph handoff to Hero |
| `src/components/Ticker.jsx` | `tail -f system.log` marquee |
| `src/components/Intro.jsx` | ABOUT_TEXT paragraph |
| `src/components/ProcessRow.jsx` | shared career/project row |
| `src/components/Sidebar.jsx` | rewritten |
| `src/components/ContentPanel.jsx` | rewritten, tab a11y + window titles |
| `src/components/{CareerSection,Education,Projects,Uses,ProjectModal}.jsx` | restyled |
| `src/App.jsx` | composition root |

## Testing approach

**Deviation from the spec, flagged for the reviewer:** the spec's Testing section says verification is visual/behavioural only, since no test infrastructure exists. This plan adds **Vitest for pure-logic modules only** (`pidFor`, `parseCommand`, `formatClock`, `liveAge`) — no jsdom, no React Testing Library, one devDependency. These four functions are where a silent bug hides (an off-by-one PID collision, a command that stops matching). Everything visual is still verified by hand against `npm run dev`.

If you would rather not add Vitest, delete Task 1 steps 1–6 and the test steps in Tasks 3 and 7; the rest of the plan is unaffected.

---

### Task 1: Test tooling + theme foundation

Adds Vitest, then lays the new palette, fonts, and pixel-window primitives *alongside* the existing gold/RPG theme. Nothing visual changes yet — the old classes still work and the site renders exactly as before. This is deliberate: it keeps every later task independently verifiable.

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.js`
- Modify: `index.html`
- Modify: `src/index.css`
- Create: `src/lib/clock.js`
- Test: `src/lib/clock.test.js`

**Interfaces:**
- Consumes: nothing
- Produces: Tailwind classes `bg-term-bg`, `text-acc-green`, `font-pixel`, `font-mono`, `font-sans` (see token table above). CSS classes `.pf-outer`, `.pf-inner`, `.pf-sm`, `.pf-lg`, `.win-bar`, `.dot`, `.btn`, `.btn-primary`, `.btn-ghost`, `.term-glow`, `.term-cursor`. `formatClock(date) -> "HH:MM:SS"`, `liveAge(now?) -> number`.

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest@^2
```

- [ ] **Step 2: Add the test script**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Write the failing test for clock helpers**

Create `src/lib/clock.test.js`:

```js
import { describe, it, expect } from "vitest"
import { formatClock, liveAge } from "./clock"

describe("formatClock", () => {
    it("zero-pads every field", () => {
        expect(formatClock(new Date(2026, 0, 1, 3, 7, 9))).toBe("03:07:09")
    })

    it("uses 24-hour time", () => {
        expect(formatClock(new Date(2026, 0, 1, 23, 59, 59))).toBe("23:59:59")
    })
})

describe("liveAge", () => {
    // Birth: December 2001.
    it("counts the birthday as passed during December", () => {
        expect(liveAge(new Date(2026, 11, 5))).toBe(25)
    })

    it("has not counted the birthday in November", () => {
        expect(liveAge(new Date(2026, 10, 5))).toBe(24)
    })
})
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./clock"`

- [ ] **Step 5: Write the implementation**

Create `src/lib/clock.js`:

```js
const BIRTH_YEAR = 2001
const BIRTH_MONTH = 12 // December, 1-indexed

const pad = (n) => String(n).padStart(2, "0")

export const formatClock = (date) =>
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

export const liveAge = (now = new Date()) =>
    now.getFullYear() - BIRTH_YEAR - (now.getMonth() + 1 < BIRTH_MONTH ? 1 : 0)
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 4 tests

- [ ] **Step 7: Add the new palette and fonts to Tailwind**

In `tailwind.config.js`, inside `theme.extend`, **add** these alongside the existing `gold` and `rpg` colors (do not delete anything yet — Task 16 does that):

```js
colors: {
  // ...keep existing gold + rpg here...
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
  // ...keep existing pixel + rpg here...
  mono: ['"JetBrains Mono"', 'monospace'],
  sans: ['"Space Grotesk"', 'sans-serif'],
},
```

- [ ] **Step 8: Load the new fonts**

In `index.html`, inside `<head>`, add:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

Leave the existing `@import` at the top of `src/index.css` alone for now — Task 16 removes it.

- [ ] **Step 9: Add the pixel-window primitives**

Append to `src/index.css`:

```css
/* ══ TERMINAL/OS THEME ══ */

:root {
  --pf-step: 8px;
  --pf-border: 4px;
}

/* Notched-corner window frame */
.pf-outer {
  background: #000000;
  padding: var(--pf-border);
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
  clip-path: polygon(
    0 var(--pf-step), var(--pf-step) var(--pf-step), var(--pf-step) 0,
    calc(100% - var(--pf-step)) 0, calc(100% - var(--pf-step)) var(--pf-step), 100% var(--pf-step),
    100% calc(100% - var(--pf-step)), calc(100% - var(--pf-step)) calc(100% - var(--pf-step)), calc(100% - var(--pf-step)) 100%,
    var(--pf-step) 100%, var(--pf-step) calc(100% - var(--pf-step)), 0 calc(100% - var(--pf-step))
  );
}

.pf-inner { background: #2d2f3d; height: 100%; }
.pf-sm { --pf-step: 5px; --pf-border: 3px; }
.pf-lg { --pf-step: 10px; --pf-border: 5px; }

/* Hero terminal only — the one animated glow on the page */
.term-glow {
  filter: drop-shadow(6px 6px 0 rgba(0, 0, 0, 0.5));
  box-shadow: none;
  animation: term-glow 4s ease-in-out infinite;
}
@keyframes term-glow {
  0%, 100% { filter: drop-shadow(6px 6px 0 rgba(0,0,0,0.5)) drop-shadow(0 0 0 rgba(80,250,123,0)); }
  50%      { filter: drop-shadow(6px 6px 0 rgba(0,0,0,0.5)) drop-shadow(0 0 14px rgba(80,250,123,0.28)); }
}

.win-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 14px;
  background: #44475a;
  border-bottom: 3px solid #000000;
}
.dot { width: 11px; height: 11px; border: 2px solid #000000; }
.dot-red { background: #ff5f56; }
.dot-amber { background: #ffbd2e; }
.dot-green { background: #27c93f; }

/* Chunky buttons */
.btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 13px 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px; font-weight: 600;
  border: 3px solid #000000;
  box-shadow: 4px 4px 0 #000000;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  cursor: pointer;
}
.btn:hover  { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #000000; }
.btn:active { transform: translate(2px, 2px);   box-shadow: 1px 1px 0 #000000; }
.btn-primary { background: #50fa7b; color: #1e1f29; }
.btn-ghost   { background: #44475a; color: #f8f8f2; }

/* Focus ring */
a:focus-visible, button:focus-visible, input:focus-visible {
  outline: 3px solid #bd93f9;
  outline-offset: 3px;
}

@keyframes term-blink { 50% { opacity: 0; } }
.term-cursor {
  display: inline-block; width: 9px; height: 16px;
  background: #50fa7b; margin-left: 2px; vertical-align: middle;
  animation: term-blink 1s steps(1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .term-glow, .term-cursor { animation: none; }
}
```

**Scroll reveal note (pre-flight ruling P-2):** the reference mockup uses a
`.reveal` / `.in-view` CSS pair driven by an IntersectionObserver. This plan
does **not** port it. Scroll reveals use framer-motion's `whileInView`
instead — already a dependency, and already this repo's established pattern
in `Experiences.jsx`, `Projects.jsx`, and `Education.jsx`. Do not add a
`.reveal` class: without an observer to add `.in-view`, `opacity: 0` content
would be permanently invisible.

- [ ] **Step 10: Verify nothing broke**

Run: `npm run lint && npm run build && npm test`
Expected: all pass.

Run `npm run dev` and load the page. Expected: the site looks **exactly as it did before** — new tokens are defined but nothing consumes them yet.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json tailwind.config.js index.html src/index.css src/lib/clock.js src/lib/clock.test.js
git commit -m "feat: add terminal theme tokens, pixel-window primitives, and vitest"
```

---

### Task 2: Motion and typewriter hooks

**Files:**
- Create: `src/hooks/useReducedMotion.js`
- Create: `src/hooks/useTypewriter.js`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `useReducedMotion() -> boolean` — reactive, updates if the OS setting changes mid-session.
  - `useTypewriter({ words, typeSpeed, deleteSpeed, holdMs, loop, enabled }) -> string` — returns the currently-visible substring. With `loop: true` it cycles words forever (sidebar role line). With `loop: false` it types `words[0]` once and stops. When `enabled` is `false` it immediately returns the full `words[0]`.

**Caller contract (pre-flight ruling P-4):** `words` appears in the effect's
dependency array, so it **must be a stable reference** — a module-scope
constant or a `useMemo` result. Passing an inline array literal
(`words={["a", "b"]}`) creates a new reference every render and restarts the
typing loop forever. Add this as a JSDoc warning on the hook.

- [ ] **Step 1: Write `useReducedMotion`**

Create `src/hooks/useReducedMotion.js`:

```js
import { useEffect, useState } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

export default function useReducedMotion() {
    const [reduced, setReduced] = useState(
        () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
    )

    useEffect(() => {
        const mq = window.matchMedia(QUERY)
        const onChange = (e) => setReduced(e.matches)
        mq.addEventListener("change", onChange)
        return () => mq.removeEventListener("change", onChange)
    }, [])

    return reduced
}
```

- [ ] **Step 2: Write `useTypewriter`**

Create `src/hooks/useTypewriter.js`:

```js
import { useEffect, useState } from "react"

/**
 * Character-by-character typing driver.
 * Replaces the react-simple-typewriter dependency, which cannot express the
 * hero terminal's prompt-then-result rhythm.
 */
export default function useTypewriter({
    words,
    typeSpeed = 55,
    deleteSpeed = 30,
    holdMs = 1000,
    loop = false,
    enabled = true,
}) {
    const [text, setText] = useState(enabled ? "" : words[0])

    useEffect(() => {
        if (!enabled) {
            setText(words[0])
            return
        }

        let cancelled = false
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

        const run = async () => {
            let i = 0
            do {
                const word = words[i % words.length]

                for (let c = 1; c <= word.length; c++) {
                    if (cancelled) return
                    setText(word.slice(0, c))
                    await sleep(typeSpeed)
                }

                if (!loop) return

                await sleep(holdMs)

                for (let c = word.length; c >= 0; c--) {
                    if (cancelled) return
                    setText(word.slice(0, c))
                    await sleep(deleteSpeed)
                }

                await sleep(200)
                i++
            } while (!cancelled)
        }

        run()
        return () => { cancelled = true }
    }, [words, typeSpeed, deleteSpeed, holdMs, loop, enabled])

    return text
}
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`
Expected: both pass. (Nothing imports these yet; this step confirms they are syntactically valid and lint-clean.)

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useReducedMotion.js src/hooks/useTypewriter.js
git commit -m "feat: add useReducedMotion and useTypewriter hooks"
```

---

### Task 3: PID helper + PixelWindow + ProcessRow

The shared row used by both the career and projects tabs. The reference duplicates this markup; here it is one component.

**Files:**
- Create: `src/lib/pid.js`
- Test: `src/lib/pid.test.js`
- Create: `src/components/PixelWindow.jsx`
- Create: `src/components/ProcessRow.jsx`

**Interfaces:**
- Consumes: `.pf-outer` / `.pf-inner` / `.win-bar` / `.dot` from Task 1.
- Produces:
  - `pidFor(seedIndex) -> string` (4-char, zero-padded)
  - `<PixelWindow title? size? glow? className? innerClassName?>{children}</PixelWindow>` — renders `.pf-outer > .pf-inner`, plus a `.win-bar` when `title` is set. `size` is `"sm" | "md" | "lg"`.
  - `<ProcessRow pid name badge sub bullets tags links image imageAlt onClick />` where `badge` is `{ label, tone }` and `tone` is one of `"running" | "stable" | "shipped" | "progress"`; `links` is `[{ label, href }]`.

- [ ] **Step 1: Write the failing test for `pidFor`**

Create `src/lib/pid.test.js`:

```js
import { describe, it, expect } from "vitest"
import { pidFor } from "./pid"

describe("pidFor", () => {
    it("zero-pads to four characters", () => {
        expect(pidFor(0)).toBe("0142")
    })

    it("advances by a fixed stride", () => {
        expect(pidFor(1)).toBe("0279")
        expect(pidFor(2)).toBe("0416")
    })

    it("never collides across distinct seeds", () => {
        const seen = new Set()
        for (let i = 0; i < 50; i++) seen.add(pidFor(i))
        expect(seen.size).toBe(50)
    })

    it("is stable across calls", () => {
        expect(pidFor(7)).toBe(pidFor(7))
    })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./pid"`

- [ ] **Step 3: Write `pidFor`**

Create `src/lib/pid.js`:

```js
const PID_BASE = 142
const PID_STRIDE = 137

/**
 * Derives a decorative process ID from a seed index.
 *
 * The reference mockup hardcoded these (0142, 0288, 0417...), which meant
 * hand-picking a number every time an entry was added to constants/index.js.
 * PIDs are decorative — they need to look plausible and stay stable across
 * renders, not match the mockup exactly.
 *
 * Career rows seed from their own index; project rows seed from
 * EXPERIENCES.length + index, so the two lists never collide.
 */
export const pidFor = (seedIndex) =>
    String(PID_BASE + seedIndex * PID_STRIDE).padStart(4, "0")
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 8 tests total

- [ ] **Step 5: Write `PixelWindow`**

Create `src/components/PixelWindow.jsx`:

```jsx
import PropTypes from "prop-types"

const SIZE_CLASS = { sm: "pf-sm", md: "", lg: "pf-lg" }

const PixelWindow = ({
    title,
    size = "md",
    glow = false,
    className = "",
    innerClassName = "",
    children,
}) => (
    <div className={`pf-outer ${SIZE_CLASS[size]} ${glow ? "term-glow" : ""} ${className}`}>
        <div className={`pf-inner ${innerClassName}`}>
            {title && (
                <div className="win-bar">
                    <span className="dot dot-red" aria-hidden="true" />
                    <span className="dot dot-amber" aria-hidden="true" />
                    <span className="dot dot-green" aria-hidden="true" />
                    <span className="ml-1.5 font-mono text-[13px] text-term-muted">{title}</span>
                </div>
            )}
            {children}
        </div>
    </div>
)

PixelWindow.propTypes = {
    title: PropTypes.string,
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    glow: PropTypes.bool,
    className: PropTypes.string,
    innerClassName: PropTypes.string,
    children: PropTypes.node,
}

export default PixelWindow
```

**Note:** `prop-types` is not currently a dependency. Install it: `npm install prop-types`. (`src/components/Uses.jsx` already imports it — it is currently resolving transitively, which is fragile. Making it a direct dependency fixes that too.)

- [ ] **Step 6: Write `ProcessRow`**

Create `src/components/ProcessRow.jsx`:

```jsx
import PropTypes from "prop-types"
import PixelWindow from "./PixelWindow"

const BADGE_TONE = {
    running:  "bg-acc-green/20 text-acc-green",
    stable:   "bg-acc-cyan/20 text-acc-cyan",
    shipped:  "bg-acc-pink/20 text-acc-pink",
    progress: "bg-acc-orange/20 text-acc-orange",
}

const ProcessRow = ({ pid, name, badge, sub, bullets = [], tags = [], links = [], image, imageAlt, onClick }) => (
    <PixelWindow innerClassName="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-4 sm:gap-[18px] px-[22px] py-5">
        <div className="font-mono text-xs text-term-muted flex sm:block gap-2 items-baseline">
            PID<span className="sm:block text-[17px] text-term-text">{pid}</span>
        </div>

        <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
                {image && (
                    <span className="w-8 h-8 border-2 border-term-outline bg-term-panel2 p-1 flex-shrink-0">
                        <img src={image} alt={imageAlt || ""} className="w-full h-full object-contain" />
                    </span>
                )}
                <span className="font-mono text-[15px] font-bold text-term-text">{name}</span>
                {badge && (
                    <span className={`font-mono text-[11px] px-2 py-0.5 border-2 border-term-outline ${BADGE_TONE[badge.tone]}`}>
                        {badge.label}
                    </span>
                )}
            </div>

            {sub && <div className="font-mono text-xs text-term-muted mb-2">{sub}</div>}

            {bullets.length > 0 && (
                <ul className="font-sans text-sm text-term-muted list-disc ml-[18px] my-1.5 space-y-1">
                    {bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
            )}

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((t) => (
                        <span key={t} className="font-mono text-xs px-2 py-0.5 bg-term-panel2 border-2 border-term-outline text-term-muted">{t}</span>
                    ))}
                </div>
            )}

            {links.length > 0 && (
                <div className="flex gap-3 mt-3">
                    {links.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                           className="font-mono text-xs text-acc-green hover:underline">
                            ▶ {l.label}
                        </a>
                    ))}
                </div>
            )}

            {onClick && (
                <button type="button" onClick={onClick}
                        className="font-mono text-xs text-acc-purple hover:underline mt-3">
                    ▶ DETAILS
                </button>
            )}
        </div>
    </PixelWindow>
)

ProcessRow.propTypes = {
    pid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    badge: PropTypes.shape({ label: PropTypes.string, tone: PropTypes.oneOf(Object.keys(BADGE_TONE)) }),
    sub: PropTypes.string,
    bullets: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    links: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, href: PropTypes.string })),
    image: PropTypes.string,
    imageAlt: PropTypes.string,
    onClick: PropTypes.func,
}

export default ProcessRow
```

- [ ] **Step 7: Verify**

Run: `npm run lint && npm run build && npm test`
Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json src/lib/pid.js src/lib/pid.test.js src/components/PixelWindow.jsx src/components/ProcessRow.jsx
git commit -m "feat: add pidFor helper, PixelWindow, and shared ProcessRow"
```

---

### Task 4: Backdrop + ScrollProgress

The two full-page decorative layers.

**Files:**
- Create: `src/components/Backdrop.jsx`
- Create: `src/components/ScrollProgress.jsx`
- Modify: `src/index.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `useReducedMotion` (Task 2)
- Produces: `<Backdrop />`, `<ScrollProgress />` — both self-contained, no props.

- [ ] **Step 1: Add backdrop CSS**

Append to `src/index.css`:

```css
/* Grid + scanlines, painted on body pseudo-elements */
body.term-theme {
  background: #282a36;
  color: #f8f8f2;
  font-family: 'Space Grotesk', sans-serif;
  line-height: 1.6;
}
body.term-theme::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(189,147,249,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(189,147,249,0.035) 1px, transparent 1px);
  background-size: 28px 28px;
}
body.term-theme::after {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 55;
  opacity: 0.45;
  background: repeating-linear-gradient(
    to bottom, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1px, transparent 2px, transparent 3px
  );
}

.particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.particle {
  position: absolute; bottom: -20px; width: 7px; height: 7px;
  border-radius: 50%; opacity: 0; animation: drift linear infinite;
}
@keyframes drift {
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  10%  { opacity: 0.8; }
  90%  { opacity: 0.8; }
  100% { transform: translateY(-110vh) translateX(24px); opacity: 0; }
}

.progress-track { position: fixed; top: 0; left: 0; right: 0; height: 4px; background: #000; z-index: 100; pointer-events: none; }
.progress-fill  { height: 100%; width: 0%; background: repeating-linear-gradient(45deg, #50fa7b 0 8px, #bd93f9 8px 16px); }

@media (prefers-reduced-motion: reduce) {
  .particles { display: none; }
}
```

- [ ] **Step 2: Write `Backdrop`**

Create `src/components/Backdrop.jsx`:

```jsx
import useReducedMotion from "../hooks/useReducedMotion"

const PARTICLES = [
    { left: "4%",  color: "#50fa7b", duration: "10s", delay: "0s" },
    { left: "14%", color: "#ff79c6", duration: "13s", delay: "2s" },
    { left: "24%", color: "#8be9fd", duration: "9s",  delay: "4s" },
    { left: "38%", color: "#bd93f9", duration: "12s", delay: "1s" },
    { left: "52%", color: "#ffb86c", duration: "11s", delay: "5s" },
    { left: "66%", color: "#ff79c6", duration: "14s", delay: "3s" },
    { left: "78%", color: "#50fa7b", duration: "10s", delay: "6s" },
    { left: "88%", color: "#8be9fd", duration: "13s", delay: "2.5s" },
    { left: "95%", color: "#bd93f9", duration: "9s",  delay: "4.5s" },
]

const Backdrop = () => {
    const reduced = useReducedMotion()
    if (reduced) return null

    return (
        <div className="particles" aria-hidden="true">
            {PARTICLES.map((p) => (
                <span
                    key={p.left}
                    className="particle"
                    style={{
                        left: p.left,
                        background: p.color,
                        boxShadow: `0 0 6px ${p.color}`,
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                    }}
                />
            ))}
        </div>
    )
}

export default Backdrop
```

- [ ] **Step 3: Write `ScrollProgress`**

Create `src/components/ScrollProgress.jsx`:

```jsx
import { useEffect, useState } from "react"

const ScrollProgress = () => {
    const [pct, setPct] = useState(0)

    useEffect(() => {
        const update = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            setPct(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0)
        }
        update()
        window.addEventListener("scroll", update, { passive: true })
        window.addEventListener("resize", update)
        return () => {
            window.removeEventListener("scroll", update)
            window.removeEventListener("resize", update)
        }
    }, [])

    return (
        <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
    )
}

export default ScrollProgress
```

- [ ] **Step 4: Mount them and switch the body class**

Rewrite `src/App.jsx`:

```jsx
import { useEffect } from "react"
import { Analytics } from "@vercel/analytics/react"
import Backdrop from "./components/Backdrop"
import ScrollProgress from "./components/ScrollProgress"
import Sidebar from "./components/Sidebar"
import ContentPanel from "./components/ContentPanel"

function App() {
    useEffect(() => {
        document.body.classList.add("term-theme")
        return () => document.body.classList.remove("term-theme")
    }, [])

    return (
        <div className="overflow-x-hidden antialiased selection:bg-acc-green/20 selection:text-acc-green">
            <ScrollProgress />
            <Backdrop />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <Sidebar />
                    <ContentPanel />
                </div>
                <Analytics />
            </div>
        </div>
    )
}

export default App
```

Also remove the `background-color: #080b12` rule from `html, body` near the top of `src/index.css` so `body.term-theme` wins.

- [ ] **Step 5: Verify**

Run: `npm run dev`

Expected: page background is now Dracula `#282a36`. A striped bar fills across the top as you scroll. Faint purple grid and horizontal scanlines are visible. Nine coloured dots drift upward. The sidebar and content panel still use the old gold styling — that is correct at this stage.

Then set your OS to reduce motion and reload. Expected: particles gone, everything else intact.

Run: `npm run lint && npm run build`

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/components/Backdrop.jsx src/components/ScrollProgress.jsx src/App.jsx
git commit -m "feat: add terminal backdrop, scanlines, particles, and scroll progress"
```

---

### Task 5: Taskbar

**Files:**
- Create: `src/components/Taskbar.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `formatClock` (Task 1)
- Produces: `<Taskbar onNavigate={(tabId) => void} />` — `tabId` is one of `"career" | "education" | "projects" | "stack"`.

- [ ] **Step 1: Add taskbar CSS**

Append to `src/index.css`:

```css
.taskbar {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(40, 42, 54, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 3px solid #000000;
  padding: 10px 20px;
}
.status-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #50fa7b; box-shadow: 0 0 6px #50fa7b;
  animation: status-pulse 2s ease-in-out infinite;
}
@keyframes status-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
@media (prefers-reduced-motion: reduce) { .status-dot { animation: none; } }
```

- [ ] **Step 2: Write `Taskbar`**

Create `src/components/Taskbar.jsx`:

```jsx
import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { formatClock } from "../lib/clock"

const NAV = ["career", "education", "projects", "stack"]

const Taskbar = ({ onNavigate }) => {
    const [now, setNow] = useState(() => formatClock(new Date()))

    useEffect(() => {
        const id = setInterval(() => setNow(formatClock(new Date())), 1000)
        return () => clearInterval(id)
    }, [])

    return (
        <header className="fixed top-0 left-0 right-0 z-[70]">
            <div className="taskbar">
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="font-mono text-sm font-bold text-term-text"
                >
                    aiman<span className="text-acc-green">@system</span>
                </button>

                <nav>
                    <ul className="hidden sm:flex gap-5 list-none">
                        {NAV.map((id) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => onNavigate(id)}
                                    className="font-mono text-[13px] text-term-muted hover:text-acc-green transition-colors"
                                >
                                    {id}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-3.5 font-mono text-xs text-term-muted">
                    <span className="status-dot" aria-hidden="true" />
                    <span>ONLINE</span>
                    <span>{now}</span>
                </div>
            </div>
        </header>
    )
}

Taskbar.propTypes = { onNavigate: PropTypes.func.isRequired }

export default Taskbar
```

- [ ] **Step 3: Mount it**

In `src/App.jsx`, lift the active-tab state up so both `Taskbar` and `ContentPanel` share it:

```jsx
import { useEffect, useState } from "react"
// ...other imports
import Taskbar from "./components/Taskbar"

function App() {
    const [activeTab, setActiveTab] = useState("career")

    useEffect(() => {
        document.body.classList.add("term-theme")
        return () => document.body.classList.remove("term-theme")
    }, [])

    const goToTab = (id) => {
        setActiveTab(id)
        document.getElementById("main")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    return (
        <div className="overflow-x-hidden antialiased selection:bg-acc-green/20 selection:text-acc-green">
            <ScrollProgress />
            <Backdrop />
            <Taskbar onNavigate={goToTab} />

            <div id="main" className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <Sidebar />
                    <ContentPanel active={activeTab} onTabChange={setActiveTab} />
                </div>
                <Analytics />
            </div>
        </div>
    )
}
```

`ContentPanel` does not accept `active` / `onTabChange` yet — it still manages its own state, so it will ignore these props harmlessly. Task 11 rewrites it to consume them.

- [ ] **Step 4: Verify**

Run: `npm run dev`

Expected: a fixed dark bar across the top with `aiman@system` on the left, four lowercase nav links in the centre (hidden below 640px), and a pulsing green dot + `ONLINE` + a ticking clock on the right. The clock advances every second. Clicking a nav link scrolls to the content — it will not switch tabs yet, which is expected until Task 11. Content is not hidden behind the bar.

Run: `npm run lint && npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/components/Taskbar.jsx src/App.jsx
git commit -m "feat: add fixed taskbar with live clock and nav"
```

---

### Task 6: Hero terminal (display only)

Builds the terminal window and its typed `$ whoami` sequence. The live command prompt comes in Task 7; the boot morph in Task 8.

**Files:**
- Create: `src/components/Hero.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `PixelWindow` (Task 3), `useReducedMotion` (Task 2)
- Produces: `<Hero onNavigate={(tabId) => void} />`

- [ ] **Step 1: Add hero CSS**

Append to `src/index.css`:

```css
.term-line { margin-bottom: 6px; color: #9aa5ce; font-size: 15px; font-family: 'JetBrains Mono', monospace; }
.term-line .term-prompt { color: #50fa7b; }
.term-line.term-result { color: #f8f8f2; }
.term-line.term-error  { color: #ff5555; }
```

- [ ] **Step 2: Write `Hero`**

Create `src/components/Hero.jsx`:

```jsx
import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import PixelWindow from "./PixelWindow"
import useReducedMotion from "../hooks/useReducedMotion"

const HERO_LINES = [
    { prompt: "$ whoami",        result: "aiman naim — full stack developer" },
    { prompt: "$ role --current", result: "full stack developer @ ernst & young" },
    { prompt: "$ mission",        result: "building compliance platforms for malaysia's ccc" },
    { prompt: "$ status",         result: "open to interesting problems ✓" },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const Hero = ({ onNavigate }) => {
    const reduced = useReducedMotion()
    // Each entry: { prompt: string, result: string | null }
    const [lines, setLines] = useState(() => (reduced ? [...HERO_LINES] : []))
    const [done, setDone] = useState(reduced)

    // Lines 0..n-1 fully settled, plus the line currently being typed.
    const settled = (n) => HERO_LINES.slice(0, n).map((l) => ({ ...l }))

    useEffect(() => {
        if (reduced) return
        let cancelled = false

        const run = async () => {
            for (let i = 0; i < HERO_LINES.length; i++) {
                const line = HERO_LINES[i]

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
    }, [reduced])

    return (
        <section className="min-h-[92vh] flex flex-col items-center justify-center pt-32 pb-10 text-center px-6">
            <div className="w-full max-w-[760px]">
                <PixelWindow size="lg" glow title="aiman@root: ~/portfolio$ ./run.sh">
                    <div className="px-6 py-[26px] text-left min-h-[240px]">
                        <div className="font-pixel text-[clamp(16px,3vw,24px)] text-term-text mb-1.5">
                            AIMAN NAIM
                        </div>
                        <div className="font-mono text-[15px] text-acc-purple mb-5 tracking-[0.04em]">
                            {"// full stack software engineer"}
                        </div>

                        {lines.map((line, i) => (
                            <div key={i}>
                                <div className="term-line"><span className="term-prompt">{line.prompt}</span></div>
                                {line.result && <div className="term-line term-result">{line.result}</div>}
                            </div>
                        ))}

                        {done && (
                            <div className="term-line">
                                <span className="term-prompt">$ </span>
                                <span className="term-cursor" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                </PixelWindow>

                <div className="flex gap-3.5 flex-wrap justify-center mt-[26px]">
                    <button type="button" className="btn btn-primary" onClick={() => onNavigate("career")}>
                        ▶ VIEW_CAREER
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => onNavigate("projects")}>
                        📁 VIEW_PROJECTS
                    </button>
                </div>
            </div>
        </section>
    )
}

Hero.propTypes = { onNavigate: PropTypes.func.isRequired }

export default Hero
```

**Implementer notes:**
- The rhythm to preserve: prompt types at 24ms/char → 160ms pause → result appears whole → 280ms pause → next line. These values are lifted from the reference and read well; don't tune them without looking.
- Array indices are safe as React keys here because the list is append-only and fixed-length — entries are never reordered, inserted, or removed. Do **not** add an `eslint-disable` for `react/no-array-index-key`: that rule is not enabled in this repo's `.eslintrc.cjs`, and the lint script runs `--report-unused-disable-directives`, so an unused disable directive is itself an error under `--max-warnings 0`.
- The subtitle must be written as `{"// full stack software engineer"}`, not as bare text. JSX does not treat `//` as a comment in a text position, and `react/jsx-no-comment-textnodes` flags it.
- The `cancelled` flag guards against the effect being torn down mid-sequence (React 18 StrictMode double-invokes effects in dev, so without it you get two interleaved typing loops).

- [ ] **Step 3: Mount it**

In `src/App.jsx`, render `<Hero onNavigate={goToTab} />` directly above the `<div id="main">` wrapper, and drop the `pt-24` from that wrapper (the hero now provides top spacing).

- [ ] **Step 4: Verify**

Run: `npm run dev`

Expected: a large notched terminal window fills the first screen, with a title bar reading `aiman@root: ~/portfolio$ ./run.sh` and three traffic-light dots. `AIMAN NAIM` renders in Press Start 2P. Four command lines type themselves out in sequence, each followed by its result, ending with a blinking green cursor. The window has a soft green glow that pulses on a 4s cycle. Both buttons sit below with hard black shadows that shift on hover. Clicking them scrolls to the content.

With reduced motion on: all four lines and the cursor render instantly, no glow animation.

Run: `npm run lint && npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/components/Hero.jsx src/App.jsx
git commit -m "feat: add hero terminal with typed command sequence"
```

---

### Task 7: Terminal command parser + live prompt

Turns the hero terminal into the site's navigation. This is the fix for the "terminal feels standalone" problem the whole redesign is built around.

**Files:**
- Create: `src/lib/terminalCommands.js`
- Test: `src/lib/terminalCommands.test.js`
- Modify: `src/components/Hero.jsx`

**Interfaces:**
- Consumes: `pidFor` is unrelated; consumes nothing new.
- Produces: `parseCommand(input) -> { type, payload }` where `type` is one of `"tab" | "help" | "clear" | "resume" | "unknown"`. For `"tab"`, `payload` is the tab id. For `"unknown"`, `payload` is the raw input. `COMMANDS` — array of `{ name, description }` for `help` output.

- [ ] **Step 1: Write the failing test**

Create `src/lib/terminalCommands.test.js`:

```js
import { describe, it, expect } from "vitest"
import { parseCommand } from "./terminalCommands"

describe("parseCommand", () => {
    it.each(["career", "education", "projects", "stack"])("maps %s to a tab", (id) => {
        expect(parseCommand(id)).toEqual({ type: "tab", payload: id })
    })

    it("is case-insensitive and trims whitespace", () => {
        expect(parseCommand("  PROJECTS  ")).toEqual({ type: "tab", payload: "projects" })
    })

    it("recognises help", () => {
        expect(parseCommand("help")).toEqual({ type: "help", payload: null })
    })

    it("recognises clear", () => {
        expect(parseCommand("clear")).toEqual({ type: "clear", payload: null })
    })

    it("recognises resume", () => {
        expect(parseCommand("resume")).toEqual({ type: "resume", payload: null })
    })

    it("reports unknown commands with the original input", () => {
        expect(parseCommand("sudo rm -rf /")).toEqual({ type: "unknown", payload: "sudo rm -rf /" })
    })

    it("treats empty input as unknown", () => {
        expect(parseCommand("   ")).toEqual({ type: "unknown", payload: "" })
    })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./terminalCommands"`

- [ ] **Step 3: Write the parser**

Create `src/lib/terminalCommands.js`:

```js
const TABS = ["career", "education", "projects", "stack"]

export const COMMANDS = [
    ...TABS.map((t) => ({ name: t, description: `open the ${t} panel` })),
    { name: "resume", description: "download resume PDF" },
    { name: "clear",  description: "clear the terminal" },
    { name: "help",   description: "list available commands" },
]

export const parseCommand = (input) => {
    const cmd = String(input ?? "").trim().toLowerCase()

    if (TABS.includes(cmd)) return { type: "tab", payload: cmd }
    if (cmd === "help")     return { type: "help", payload: null }
    if (cmd === "clear")    return { type: "clear", payload: null }
    if (cmd === "resume")   return { type: "resume", payload: null }

    return { type: "unknown", payload: String(input ?? "").trim() }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 18 tests total

- [ ] **Step 5: Add the live prompt to `Hero`**

Extend `src/components/Hero.jsx`:

- Add state: `const [history, setHistory] = useState([])` — entries are `{ prompt, result }` appended below the scripted lines.
- Add state: `const [draft, setDraft] = useState("")`.
- Add a `runCommand(raw)` function:

```jsx
const runCommand = (raw) => {
    const { type, payload } = parseCommand(raw)
    const entry = { prompt: `$ ${raw}`, result: null }

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
        const link = document.createElement("a")
        link.href = "/Aiman_Naim_Resume.pdf"
        link.download = "Aiman_Naim_Resume.pdf"
        link.click()
    } else {
        entry.result = `command not found: ${payload || "(empty)"}`
    }

    setHistory((h) => [...h, entry])
    setDraft("")
}
```

- Render `history` after the scripted lines. Results containing `\n` need `whitespace-pre-wrap` so `help` output keeps its columns.
- **Unknown-command results must use the `.term-error` CLASS, not the `text-acc-red` Tailwind utility.** A Tailwind colour utility is specificity (0,1,0) and is emitted at `@tailwind utilities` near the top of the stylesheet; `.term-line.term-result` is (0,2,0) and defined later in `index.css`, so it wins on both specificity and source order and the error text renders plain white. Verified against the built CSS. Use `className="term-line term-error whitespace-pre-wrap"` — do not combine it with `term-result`.
- Replace the static `done &&` cursor block with the input form:

```jsx
{done && (
    <form onSubmit={(e) => { e.preventDefault(); runCommand(draft) }} className="term-line flex items-center">
        <label htmlFor="term-input" className="term-prompt">$&nbsp;</label>
        <input
            id="term-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoComplete="off"
            spellCheck="false"
            aria-label="Terminal command input"
            className="flex-1 bg-transparent border-0 outline-none font-mono text-[15px] text-term-text caret-acc-green"
        />
    </form>
)}
```

- **Mobile:** below `640px` render command chips instead of the input, so the OS keyboard never covers the content. Use a `matchMedia("(min-width: 640px)")` check (same pattern as `useReducedMotion`) rather than CSS alone, so the input is not merely hidden but absent from the DOM. **Render them as a single either/or — `{isDesktop ? <form.../> : <chips.../>}` — NOT as a form plus a `sm:hidden` chip row.** A `sm:hidden` class only hides the chips on desktop; it leaves the input in the DOM at every width, which is the exact failure being avoided. The snippet below shows the chips only; wire it as the else-branch:

```jsx
<div className="flex flex-wrap gap-2 mt-2 sm:hidden">
    {COMMANDS.map((c) => (
        <button key={c.name} type="button" onClick={() => runCommand(c.name)}
                className="font-mono text-xs px-2.5 py-1.5 bg-term-panel2 border-2 border-term-outline text-acc-green">
            {c.name}
        </button>
    ))}
</div>
```

- Wire the two CTA buttons through `runCommand("career")` / `runCommand("projects")` instead of calling `onNavigate` directly, so both paths visibly do the same thing.
- After the scripted sequence finishes, append one hint line: `type 'help' for commands`.

- [ ] **Step 6: Verify**

Run: `npm run dev`

Expected, on desktop: after the four scripted lines, a live `$` prompt with a green caret. Type `projects` + Enter → the line is echoed, `opening ~/projects...` prints, and the page scrolls down. Type `help` → a list of seven commands in aligned columns. Type `banana` → `command not found: banana` in red. Type `clear` → history empties, prompt remains. Type `resume` → the PDF downloads. Click `▶ VIEW_CAREER` → `$ career` appears in the terminal and the page navigates.

On a 375px viewport: no text input; a row of tappable command chips instead. Tapping `stack` navigates.

Run: `npm run lint && npm run build && npm test`

- [ ] **Step 7: Commit**

```bash
git add src/lib/terminalCommands.js src/lib/terminalCommands.test.js src/components/Hero.jsx
git commit -m "feat: make the hero terminal the site navigation"
```

---

### Task 8: Boot screen with morph to hero

**Files:**
- Create: `src/components/BootScreen.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `useReducedMotion` (Task 2)
- Produces: `<BootScreen onFinish={() => void} />`. Reads/writes `sessionStorage` key `"boot-complete"`.

- [ ] **Step 1: Add boot CSS**

Append to `src/index.css`:

```css
.boot-screen {
  position: fixed; inset: 0; z-index: 200; background: #1e1f29;
  display: flex; align-items: center; justify-content: center; padding: 24px;
  transition: opacity 0.5s ease;
}
.boot-screen.is-hiding { opacity: 0; pointer-events: none; }
.boot-box { width: 100%; max-width: 620px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #50fa7b; }
.boot-box .boot-line { margin-bottom: 6px; opacity: 0.92; white-space: pre-wrap; }
.boot-box .boot-line.is-warn { color: #ffb86c; }
body.boot-active { overflow: hidden; height: 100vh; }
```

- [ ] **Step 2: Write `BootScreen`**

Create `src/components/BootScreen.jsx`:

```jsx
import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import useReducedMotion from "../hooks/useReducedMotion"

const BOOT_LINES = [
    { text: "[ 0.0021 ] AIMAN.SYS kernel booting..." },
    { text: "[ 0.1840 ] mounting /career /education /projects /stack ... OK" },
    { text: "[ 0.4020 ] loading profile: aiman naim ................ OK" },
    { text: "[ 0.6710 ] fetching codestats.net/api ................. WARN", warn: true },
    { text: "[ 0.9330 ] compiling portfolio.tsx ..................... OK" },
    { text: "[ 1.2050 ] starting session-daemon ..................... OK" },
    { text: "[ 1.4400 ] launching AIMAN_NAIM v3.0 ..." },
]

export const BOOT_KEY = "boot-complete"

const BootScreen = ({ onFinish }) => {
    const reduced = useReducedMotion()
    const [shown, setShown] = useState(0)
    const [hiding, setHiding] = useState(false)

    useEffect(() => {
        if (reduced) { onFinish(); return }

        document.body.classList.add("boot-active")
        let cancelled = false

        const run = async () => {
            for (let i = 1; i <= BOOT_LINES.length; i++) {
                if (cancelled) return
                setShown(i)
                await new Promise((r) => setTimeout(r, 220))
            }
        }
        run()

        return () => { cancelled = true; document.body.classList.remove("boot-active") }
    }, [reduced, onFinish])

    const finish = () => {
        if (hiding) return
        setHiding(true)
        sessionStorage.setItem(BOOT_KEY, "1")
        document.body.classList.remove("boot-active")
        setTimeout(onFinish, 500)
    }

    useEffect(() => {
        if (reduced) return
        window.addEventListener("keydown", finish)
        window.addEventListener("pointerdown", finish)
        const auto = setTimeout(finish, 4200)
        return () => {
            window.removeEventListener("keydown", finish)
            window.removeEventListener("pointerdown", finish)
            clearTimeout(auto)
        }
    }, [reduced, onFinish])

    if (reduced) return null

    return (
        <div className={`boot-screen ${hiding ? "is-hiding" : ""}`} role="status" aria-live="polite">
            <div className="boot-box">
                {BOOT_LINES.slice(0, shown).map((l) => (
                    <div key={l.text} className={`boot-line ${l.warn ? "is-warn" : ""}`}>{l.text}</div>
                ))}
                <button type="button" onClick={finish} className="btn btn-ghost mt-5 text-xs">
                    SKIP ▶
                </button>
            </div>
        </div>
    )
}

BootScreen.propTypes = { onFinish: PropTypes.func.isRequired }

export default BootScreen
```

**Effect dependencies matter here.** The listener effect MUST have a dependency
array. Without one it re-runs on every render — and since `setShown` fires seven
times during boot, that means tearing down and re-registering the window
listeners seven times AND restarting the 4.2s auto-dismiss timer each tick, so
the boot would never auto-dismiss on schedule. `finish` must also be stable
(wrap in `useCallback`) or guarded against double-firing, since all four dismiss
paths converge on it.

- [ ] **Step 3: Gate it in `App.jsx`**

```jsx
const [booted, setBooted] = useState(() => sessionStorage.getItem("boot-complete") === "1")

// ...
{!booted && <BootScreen onFinish={() => setBooted(true)} />}
```

Pass `booted` into `<Hero started={booted} />` and have `Hero`'s typing effect wait for `started === true` before running, so the hero does not type behind the boot overlay.

- [ ] **Step 4: Implement the morph**

The boot window should animate into the hero terminal's position rather than cross-fading, per the spec.

Approach: give `BootScreen`'s `.boot-box` and `Hero`'s `PixelWindow` each a ref. On `finish()`, measure both with `getBoundingClientRect()`, then apply a FLIP transform to the boot box — translate and scale it from its fullscreen rect to the hero rect over ~500ms with `transform` only (never `width`/`height`, which cannot be GPU-composited), while fading the boot text out and the hero content in.

**Fallback (explicitly sanctioned by the spec):** if the FLIP proves unstable — jumpy scaling, or the notched `clip-path` distorting under `scale()` — fall back to a cross-fade in place: boot box fades out, hero fades in at its final position, no size animation. Do **not** revert to the reference's behaviour of a hard cut between two visually distinct terminals; the continuity is the point of this task.

- [ ] **Step 5: Verify**

Run: `npm run dev` in a fresh tab (or clear `sessionStorage`).

Expected: fullscreen dark boot screen, seven kernel lines appearing at ~220ms intervals, the `codestats` line in orange. A `SKIP ▶` button is visible throughout. Pressing any key, clicking, or waiting ~4.2s transitions the boot window into the hero terminal — continuous, never two terminals visible at once. The hero then types its four lines.

Reload the page. Expected: **boot does not replay** — you land directly on the hero. Open a new tab to the same URL: boot plays again (session-scoped, not permanent).

With reduced motion: no boot at all, page renders immediately.

Run: `npm run lint && npm run build`

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/components/BootScreen.jsx src/App.jsx src/components/Hero.jsx
git commit -m "feat: add boot sequence that morphs into the hero terminal"
```

---

### Task 9: Ticker + Intro

**Files:**
- Create: `src/components/Ticker.jsx`
- Create: `src/components/Intro.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `ABOUT_TEXT` from `src/constants`
- Produces: `<Ticker />`, `<Intro />` — no props.

- [ ] **Step 1: Add ticker CSS**

Append to `src/index.css`:

```css
.ticker { width: 100%; overflow: hidden; background: #44475a; border-top: 3px solid #000; border-bottom: 3px solid #000; position: relative; z-index: 1; }
.ticker-label { position: absolute; top: 0; left: 0; bottom: 0; display: flex; align-items: center; padding: 0 14px; background: #000; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #50fa7b; z-index: 2; }
.ticker-track { display: flex; width: max-content; animation: ticker-marquee 28s linear infinite; padding-left: 140px; }
.ticker-track span { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #9aa5ce; padding: 14px 0; white-space: nowrap; }
@keyframes ticker-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }
```

- [ ] **Step 2: Write `Ticker`**

Create `src/components/Ticker.jsx`:

```jsx
const ITEMS = [
    { tone: "ok",   label: "[OK]",   text: "full stack developer @ ernst & young" },
    { tone: "ok",   label: "[OK]",   text: "angular + node/express + gcp" },
    { tone: "warn", label: "[INFO]", text: "building compliance platforms for malaysia's ccc" },
    { tone: "ok",   label: "[OK]",   text: "uitm computer science grad, cgpa 3.53" },
    { tone: "warn", label: "[INFO]", text: "codestats streak: active" },
]

const Run = () => (
    <span>
        {ITEMS.map((it) => (
            <span key={it.text}>
                <span className={it.tone === "ok" ? "text-acc-green" : "text-acc-orange"}>{it.label}</span>
                {` ${it.text}  •  `}
            </span>
        ))}
    </span>
)

const Ticker = () => (
    <div className="ticker" aria-hidden="true">
        <span className="ticker-label">tail -f system.log</span>
        <div className="ticker-track">
            <Run />
            <Run />
        </div>
    </div>
)

export default Ticker
```

The track is duplicated because the `-50%` translate requires exactly two identical runs to loop seamlessly.

- [ ] **Step 3: Write `Intro`**

Create `src/components/Intro.jsx`:

```jsx
import { ABOUT_TEXT } from "../constants"

const Intro = () => (
    <section className="max-w-[1120px] mx-auto px-6 pt-[60px] pb-10">
        <div className="text-center max-w-[700px] mx-auto">
            <p className="font-sans text-base text-term-muted">{ABOUT_TEXT}</p>
        </div>
    </section>
)

export default Intro
```

- [ ] **Step 4: Mount them** in `App.jsx`, between `<Hero />` and `<div id="main">`, in the order `Hero → Ticker → Intro → main`.

- [ ] **Step 5: Verify**

Run: `npm run dev`

Expected: below the hero, a black-bordered strip with a fixed `tail -f system.log` label on the left and log entries scrolling right-to-left, looping without a visible seam. `[OK]` in green, `[INFO]` in orange. Below it, the `ABOUT_TEXT` paragraph centred in Space Grotesk. With reduced motion, the ticker is static.

Run: `npm run lint && npm run build`

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/components/Ticker.jsx src/components/Intro.jsx src/App.jsx
git commit -m "feat: add system.log ticker and intro block"
```

---

### Task 10: Sidebar rewrite

**Files:**
- Rewrite: `src/components/Sidebar.jsx`

**Interfaces:**
- Consumes: `PixelWindow` (Task 3), `useTypewriter` (Task 2), `liveAge` (Task 1)
- Produces: `<Sidebar />` — no props.

- [ ] **Step 1: Rewrite the component**

Keep every piece of content the current `Sidebar.jsx` has — avatar, LV badge, name, location + age, role typewriter, six social buttons (LinkedIn, GitHub, Instagram, Threads, Discord-copy, Resume-download), the Surah Ash-Sharh quote, and the footer credits. Only the styling changes.

Structural changes from the current version:
- Wrap in `<PixelWindow>` instead of `.rpg-panel`.
- Avatar: `128×128`, `object-cover`, no rounding, with a `2px solid black` frame. LV badge sits at `bottom-[-6px] right-[-6px]`, `bg-acc-green text-[#1e1f29]`, `border-2 border-term-outline`.
- Name in `font-pixel text-[19px] text-term-text`.
- Role line: `font-mono text-sm text-acc-purple`, wrapped in `[ ]` brackets in `text-term-muted`, with a blinking `.term-cursor`. Drive it with:

```jsx
const ROLE_WORDS = [
    "Full Stack Developer", "Front End Developer", "Back End Developer",
    "Coder", "Programmer", "Software Engineer", "Tech Enthusiast",
]
const role = useTypewriter({ words: ROLE_WORDS, loop: true, enabled: !reduced })
```

- Socials: `grid-cols-3 gap-2`. Each is `bg-term-panel2 border-2 border-term-outline shadow-[2px_2px_0_#000]`, hovering to `translate(-1px,-1px)` + `shadow-[3px_3px_0_#000]` + `text-acc-green border-acc-green`. Keep `react-icons` for the glyphs — the reference uses bare unicode (`🔗`, `⌨`, `◈`, `@`, `✉`), which renders inconsistently across platforms. The Resume button additionally gets `bg-acc-green/10 text-acc-green`.
- Quote box: `border-l-[3px] border-acc-purple bg-term-panel2 px-3.5 py-3`. Label in `font-pixel text-[8px] text-acc-purple`. Quote in `font-sans text-sm italic text-term-text`. Citation in `font-mono text-[11px] text-term-muted`.
- Footer: `font-mono text-[10px] text-term-muted`, `border-t border-white/10 pt-3.5`. **Copy must read** `Built with React, Tailwind & Vite — pixel/terminal edition` (the reference says "HTML, CSS & JS", which is false of what ships — see spec).
- Delete the `react-simple-typewriter` import.

- [ ] **Step 2: Verify**

Run: `npm run dev`

Expected: the sidebar is a notched black-framed window. Avatar is square with a green `LV.24` badge overlapping its bottom-right. Name in pixel font. The role line cycles through all seven titles, typing and deleting, with a blinking green cursor. Six social tiles in a 3×2 grid lift on hover. Clicking Discord swaps its label to `COPIED` for 1.5s; clicking Resume downloads the PDF. Quote box has a purple left rule.

With reduced motion: the role line shows `Full Stack Developer` statically.

Run: `npm run lint && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/Sidebar.jsx
git commit -m "feat: restyle sidebar for terminal theme"
```

---

### Task 11: ContentPanel rewrite

**Files:**
- Rewrite: `src/components/ContentPanel.jsx`

**Interfaces:**
- Consumes: `PixelWindow` (Task 3); `active` / `onTabChange` props wired in Task 5.
- Produces: `<ContentPanel active onTabChange />` — now fully controlled by `App`.

- [ ] **Step 1: Rewrite the component**

- Remove the internal `useState`; the active tab is now controlled via the `active` prop, with `onTabChange` to update it. This is what lets the taskbar, the hero terminal, and the tab bar all drive the same state.

- **CRITICAL — the tech-stack tab id must be `"stack"`, not `"uses"`.** The
  pre-redesign `ContentPanel` used `id: "uses"` for that tab. Every piece of new
  code uses `"stack"`: `Taskbar`'s `NAV` array (Task 5), `parseCommand`'s `TABS`
  (Task 7), and the `TITLES` map below. If you carry the legacy `"uses"` id
  forward when rewriting, the taskbar's `stack` link and the terminal's `stack`
  command will both silently match no panel and do nothing — no error, no
  console warning. The component file stays named `Uses.jsx`; only the tab id
  changes.
- Tab bar: four buttons, `font-mono text-[13px] px-4 py-2.5 bg-term-panel2 border-2 border-term-outline shadow-[2px_2px_0_#000]`. Active gets `bg-acc-green text-[#1e1f29]` and shows a `►` marker; inactive shows the marker at `opacity-0` so widths do not shift.
- Keep the existing emoji + `react-icons` labels: 💼 CAREER, 🎓 EDUCATION, 📁 PROJECTS, 🛠 STACK.
- Wrap the panel in `<PixelWindow>` with a **per-tab title**:

```js
const TITLES = {
    career:    "aiman@root: ~/career.log",
    education: "aiman@root: ~/education.log",
    projects:  "aiman@root: ~/projects",
    stack:     "aiman@root: ~/stack.log",
}
```

- **Accessibility (required):** the tab bar gets `role="tablist"`; each button `role="tab"`, `aria-selected={isActive}`, `aria-controls={`panel-${id}`}`, `id={`tab-${id}`}`, and `tabIndex={isActive ? 0 : -1}`. Each panel gets `role="tabpanel"`, `id={`panel-${id}`}`, `aria-labelledby={`tab-${id}`}`. Implement arrow-key navigation between tabs (Left/Right move focus and selection, Home/End jump to first/last).
- Keep the framer-motion `AnimatePresence` fade between panels.

- [ ] **Step 2: Verify**

Run: `npm run dev`

Expected: four chunky tab buttons; the active one is solid green with a `►`. The panel below is a notched window whose title bar changes per tab (`~/career.log`, `~/education.log`, `~/projects`, `~/stack.log`). Tab with the keyboard: arrow keys move between tabs, Home/End jump to the ends. Clicking a taskbar nav link switches the tab *and* scrolls. Typing `education` in the hero terminal switches the tab. All three controls stay in sync.

Run: `npm run lint && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/ContentPanel.jsx
git commit -m "feat: restyle content panel with per-tab window titles and tab a11y"
```

---

### Task 12: Career tab

**Files:**
- Rewrite: `src/components/CareerSection.jsx`
- Delete: `src/components/Experiences.jsx`

**Interfaces:**
- Consumes: `ProcessRow` + `pidFor` (Task 3), `EXPERIENCES` from `src/constants`

- [ ] **Step 1: Fold `Experiences` into `CareerSection`**

`CareerSection` currently renders an intro dialog box plus `<Experiences />`. The intro paragraph now lives in the top-level `<Intro />` (Task 9), so it is removed here to avoid showing `ABOUT_TEXT` twice on the page. `Experiences.jsx` collapses into a `ProcessRow` map and is deleted.

```jsx
import { EXPERIENCES } from "../constants"
import ProcessRow from "./ProcessRow"
import { pidFor } from "../lib/pid"

const CareerSection = () => (
    <div className="flex flex-col gap-4">
        {EXPERIENCES.map((exp, i) => {
            const isCurrent = exp.year.toLowerCase().includes("current")
            return (
                <ProcessRow
                    key={exp.company}
                    pid={pidFor(i)}
                    name={exp.company}
                    badge={isCurrent
                        ? { label: "RUNNING", tone: "running" }
                        : { label: "COMPLETED", tone: "stable" }}
                    sub={`${exp.role} — ${exp.year.replace(" - ", " · ")}`}
                    bullets={exp.description}
                    tags={exp.technologies}
                    image={exp.image}
                    imageAlt={exp.company}
                />
            )
        })}
    </div>
)

export default CareerSection
```

Note `formatDuration` from `Experiences.jsx` is dropped — the reference's `.proc-sub` shows the raw date range, not a computed duration. If you want the duration back, append it to `sub`; it is not in the reference design.

- [ ] **Step 2: Verify**

Run: `npm run dev`, open the CAREER tab.

Expected: two notched rows. First: `PID 0142`, the EY logo as a small bordered chip, `Ernst & Young`, a green `RUNNING` badge, `Full Stack Developer — October 2024 · Current`, three bullets, twelve tags. Second: `PID 0279`, Ryt Bank logo, a cyan `COMPLETED` badge. `ABOUT_TEXT` appears only once on the page (in the intro block, not here).

Run: `npm run lint && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/CareerSection.jsx
git rm src/components/Experiences.jsx
git commit -m "feat: restyle career tab as process rows"
```

---

### Task 13: Projects tab + modal

**Files:**
- Rewrite: `src/components/Projects.jsx`
- Restyle: `src/components/ProjectModal.jsx`

**Interfaces:**
- Consumes: `ProcessRow` + `pidFor` (Task 3), `EXPERIENCES` (for the PID seed offset), `PROJECTS` + `SMALL_PROJECTS` from `src/constants`

- [ ] **Step 1: Rewrite `Projects`**

Render `[...PROJECTS, ...SMALL_PROJECTS]` as a single `ProcessRow` list — the reference drops the featured/other split and the rarity-card system entirely.

- PID seed: `pidFor(EXPERIENCES.length + index)` so career and project PIDs never collide.
- Badge: `{ label: "LIVE", tone: "shipped" }` when the project has a `liveLink`, otherwise `{ label: "CODE", tone: "progress" }`.
- `sub` is `project.subtitle`.
- `bullets`: `description` is a string for two `SMALL_PROJECTS` entries and an array for the rest. Normalise: `Array.isArray(d) ? d : [d]`.
- `tags`: `project.technologies`.
- `links`: build from `githubLink` → `{ label: "GITHUB", href }` and `liveLink` → `{ label: "LIVE DEMO", href }`.
- `image`: `project.image` (three entries have none — `ProcessRow` already handles `undefined`).
- `onClick`: opens `ProjectModal` for that project, preserving the existing `useState` + `AnimatePresence` pattern.

**Per the spec, keep the fuller `constants/index.js` bullet text** — do not substitute the reference's condensed 3-bullet versions.

- [ ] **Step 2: Restyle `ProjectModal`**

Swap the gold panel styling for `PixelWindow`, `font-mono` chrome, and the Dracula palette. Keep its existing behaviour (backdrop click to close, scroll lock, the `scrollbar-modal` custom scrollbar — recolour its thumb to `#44475a`).

**Critical:** the scanline overlay sits at `z-index: 55`. The modal and its backdrop must render **above** that or they will look veiled. Give the backdrop `z-index: 150`.

- [ ] **Step 3: Verify**

Run: `npm run dev`, open the PROJECTS tab.

Expected: five rows with PIDs `0416`, `0553`, `0690`, `0827`, `0964` — continuing from the career PIDs with no collisions. Gadget Universe and CampVenture carry pink `LIVE` badges and both GITHUB + LIVE DEMO links; the other three carry orange `CODE` badges and GITHUB only. Screenshots appear as framed chips on the rows that have them. Clicking `▶ DETAILS` opens the modal, which renders crisply **above** the scanlines with no grey veil. Escape and backdrop-click both close it.

Run: `npm run lint && npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/Projects.jsx src/components/ProjectModal.jsx
git commit -m "feat: restyle projects tab as process rows and update modal"
```

---

### Task 14: Education tab

**Files:**
- Rewrite: `src/components/Education.jsx`

- [ ] **Step 1: Rewrite as `.edu-row` list**

Replace the timeline-gem layout with the reference's simpler bordered rows. Render `EDUCATION` **newest first** (the constant is already ordered UiTM → Matriculation → SPM, so map it directly — the current component's `.reverse()` is dropped).

Each row: `bg-term-panel2 border-l-[3px] border-acc-cyan px-[18px] py-4`, containing
- year — `font-mono text-xs text-acc-cyan`
- degree — `font-mono text-[15px] font-bold text-term-text`
- school — `font-sans text-sm text-term-muted`
- description — `font-mono text-[13px] text-acc-purple`

Per the spec, **keep the crest images**: add each `education.logo` as a `40×40` chip with `border-2 border-term-outline bg-term-panel p-1 object-contain`, floated left of the text. Drop the `STAGE_ICONS` / `STAGE_LABELS` arrays and the `react-icons` import — the crests replace them.

Keep the `timeline-gem` and `timeline-line` CSS rules in place for now; Task 16 removes them.

- [ ] **Step 2: Verify**

Run: `npm run dev`, open the EDUCATION tab.

Expected: three rows with cyan left rules, newest (UiTM 2020–2023) first, each showing its crest. No gems, no vertical timeline.

Run: `npm run lint && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/Education.jsx
git commit -m "feat: restyle education tab as bordered rows"
```

---

### Task 15: Tech stack tab

**Files:**
- Rewrite: `src/components/Uses.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `useCodeStats` (**unchanged**), `PixelWindow` (Task 3)

- [ ] **Step 1: Add stack CSS**

Append to `src/index.css`:

```css
.tools-marquee { overflow: hidden; }
.tools-track { display: flex; gap: 10px; width: max-content; animation: tools-marquee 22s linear infinite; }
.tools-marquee:hover .tools-track { animation-play-state: paused; }
@keyframes tools-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

.stat-track { flex: 1; height: 10px; background: #44475a; border: 2px solid #000; position: relative; overflow: hidden; }
.stat-fill  { height: 100%; background: #50fa7b; width: 0%; transition: width 1s ease; }
.stat-fill.is-hp { background: #ff5555; }
.stat-fill.is-mp { background: #8be9fd; }

@media (prefers-reduced-motion: reduce) {
  .tools-track { animation: none; }
  .stat-fill { transition: none; }
}
```

- [ ] **Step 2: Rewrite `Uses`**

Four blocks, each labelled with `font-pixel text-[9px] text-term-muted tracking-[0.08em]` and wrapped in a `<PixelWindow>`:

1. **TOOLS I USE** — the existing `TOOLS` array (keep the richer icon+colour version, not the reference's plain strings) rendered twice into `.tools-track` for a seamless loop. Chips: `font-mono text-[13px] px-4 py-2.5 bg-term-panel2 border-2 border-term-outline text-term-text whitespace-nowrap`.
2. **CODE::STATS — LIVE** — the source line linking to `codestats.net/users/aimxnaim`, then HP and MP bars from the hook's `hp` / `mp`. Row shape: a `120px` name column, `.stat-track` with a `.stat-fill`, and a right-aligned `76px` XP column showing `xp.toLocaleString() + " XP"`. While `loading`, show `LOADING STATS...`; on `error`, show `COULD NOT REACH CODESTATS.NET` in `text-acc-red`.
3. **LANGUAGE PROFICIENCY** — `langs` as bars, each width `Math.max(Math.round((xp / langs[0].xp) * 100), 3)%`.
4. **TIME BY MACHINE** — `machines`, same bar treatment.
5. **HARDWARE SETUP** — the existing `GEAR` array in a `grid-cols-2 sm:grid-cols-4 gap-3` of `bg-term-panel2 border-2 border-term-outline p-4 text-center font-mono text-xs`.

Reuse the existing `StatBar` / `XpBars` / `StatsBlock` helpers where they fit; recolour rather than rewrite.

- [ ] **Step 3: Verify**

Run: `npm run dev`, open the STACK tab.

Expected: a tool chip marquee that pauses on hover; a red HP bar at 100% and a cyan MP bar sized to today's XP, both with XP counts; language and machine bars in green; a 4-up hardware grid. Bars animate in over ~1s.

Then block `codestats.net` in devtools and reload. Expected: `COULD NOT REACH CODESTATS.NET` in red, no crash, the rest of the tab intact.

Run: `npm run lint && npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/components/Uses.jsx
git commit -m "feat: restyle tech stack tab with terminal theme"
```

---

### Task 16: Remove the old theme

Every component now uses the new tokens, so the gold/RPG layer is dead code. This task deletes it — which is also how you find anything that was silently still depending on it.

**Files:**
- Modify: `tailwind.config.js`, `src/index.css`, `package.json`, `src/constants/index.js`

- [ ] **Step 1: Find remaining references**

```bash
grep -rn "gold-\|rpg-panel\|rpg-font\|bg-rpg\|dialog-box\|timeline-gem\|inv-slot\|rarity-\|feature-pulse\|badge-active\|badge-completed\|rpg-menu-btn\|stat-bar-\|bar-hp\|bar-mp\|bar-exp" src/
```

Expected: no matches. Fix any that appear before continuing.

- [ ] **Step 2: Delete the old Tailwind tokens**

From `tailwind.config.js`, remove the `gold` and `rpg` color scales and the `pixel`/`rpg` font entries — **except** keep `pixel: ['"Press Start 2P"', 'monospace']`, which the new design still uses. Remove `rpg: ['"VT323"', ...]`.

- [ ] **Step 3: Delete the old CSS**

From `src/index.css`, remove: the Google Fonts `@import` line (fonts now load via `index.html`), the `:root { font-family: 'Inter' }` rule, the `html, body { background-color: #080b12 }` rule, `.rpg-font`, `.bg-rpg`, `.rpg-panel`, `.rpg-panel-sm`, `.rpg-panel-dim`, `.stat-bar-track`, `.stat-bar-fill`, all `.bar-*` rules, `.marquee` / `.marquee-track` / `@keyframes marquee-scroll`, `.timeline-gem` / `.timeline-line` / `@keyframes gem-pulse`, `@keyframes cursor-blink`, `.dialog-box`, `.inv-slot`, `.badge-active`, `.badge-completed`, all `.rarity-*`, `.rpg-menu-btn` and variants, `.feature-pulse` / `@keyframes pulse-ring`.

Keep: `@tailwind` directives, `.pixel-font`, `@keyframes blink` / `.blink` (if still referenced — check with grep), `.scrollbar-modal` (recoloured in Task 13), `.container`, `img { max-width }`, the `h1` media query, and everything added by Tasks 1–15.

- [ ] **Step 4: Remove the dead dependency**

```bash
npm uninstall react-simple-typewriter
```

Confirm nothing imports it: `grep -rn "react-simple-typewriter" src/` → no matches.

- [ ] **Step 5: Update the portfolio project description**

In `src/constants/index.js`, the `Website Portfolio` entry in `SMALL_PROJECTS` describes the old stack. Update its `description` and `technologies` to reflect what now ships (React, Tailwind, Vite, framer-motion — `react-simple-typewriter` is gone).

- [ ] **Step 6: Full verification pass**

```bash
npm run lint && npm test && npm run build
```

Then `npm run dev` and walk the whole site:

- boot plays once per session, `SKIP ▶` works, morph into hero is continuous
- all four hero commands work; `help`, `clear`, `resume`, and an unknown command behave
- taskbar clock ticks; nav links switch tabs and scroll
- all four tabs render, keyboard-navigable, correct window titles
- project modal opens above the scanlines
- CodeStats bars populate
- check 375px, 768px, and 1280px — no horizontal scroll at any width; mobile shows command chips, not a text input
- toggle reduced motion: no boot, no typing, no marquees, no particles, no glow

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.js src/index.css package.json package-lock.json src/constants/index.js
git commit -m "chore: remove gold/RPG theme and react-simple-typewriter"
```

---

## Self-review notes

**Spec coverage:** every spec section maps to a task — palette/typography/surfaces → Task 1; component structure → Tasks 2–15; terminal-as-nav (boot morph + live prompt) → Tasks 7–8; accessibility & motion → threaded through every task, with tab a11y in Task 11 and boot gating in Task 8; content deltas → Tasks 10 (footer copy), 12 (badges), 13 (fuller bullets), 15 (richer TOOLS), 16 (portfolio description); deferred game → excluded, recorded in Global Constraints.

**Known deviations from the spec, both flagged inline for the reviewer:**
1. Vitest is added for four pure functions (spec said visual verification only).
2. `prop-types` becomes a direct dependency (Task 3) — `Uses.jsx` already imports it transitively, which is fragile.

**Riskiest task:** Task 8's boot→hero FLIP morph. It has an explicitly sanctioned fallback (cross-fade in place). If it eats more than an hour, take the fallback and move on — the continuity matters, the specific animation does not.

**Ordering constraint:** Task 1 must land first (everything depends on the tokens), and Task 16 must land last (it deletes the old theme, which earlier tasks still rely on). Tasks 12–15 are independent of each other and can be done in any order or in parallel.
