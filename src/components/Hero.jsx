import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import PixelWindow from "./PixelWindow"
import useReducedMotion from "../hooks/useReducedMotion"
import useMediaQuery from "../hooks/useMediaQuery"
import { parseCommand, COMMANDS } from "../lib/terminalCommands"

const HERO_LINES = [
    { prompt: "$ whoami",        result: "aiman naim — full stack developer" },
    { prompt: "$ role --current", result: "full stack developer @ ernst & young" },
    { prompt: "$ mission",        result: "building compliance platforms for malaysia's ccc" },
    { prompt: "$ status",         result: "open to interesting problems ✓" },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Built on the shared useMediaQuery hook so the input can be truly absent
// from the DOM below the breakpoint (rather than merely hidden with CSS,
// which would still summon the mobile keyboard on focus). 900px covers
// iPad portrait and landscape phones, where a 640px threshold left the
// text input mounted and tapping it opened the OS keyboard over the content.
const DESKTOP_QUERY = "(min-width: 900px)"
const useIsDesktop = () => useMediaQuery(DESKTOP_QUERY)

const Hero = ({ onNavigate, started = true, windowRef }) => {
    const reduced = useReducedMotion()
    const isDesktop = useIsDesktop()

    // Each entry: { prompt: string, result: string | null }
    const [lines, setLines] = useState(() => (reduced ? [...HERO_LINES] : []))
    const [done, setDone] = useState(reduced)

    // Live prompt state: history of executed commands, plus the in-progress draft.
    const [history, setHistory] = useState([])
    const [draft, setDraft] = useState("")

    // The text input only exists at desktop width; chip buttons take over
    // below it. Without this, text typed before narrowing the viewport
    // would silently persist in state and reappear if the viewport widens
    // again, with no visible field to show it was ever there.
    useEffect(() => {
        setDraft("")
    }, [isDesktop])

    // Lines 0..n-1 fully settled, plus the line currently being typed.
    const settled = (n) => HERO_LINES.slice(0, n).map((l) => ({ ...l }))

    useEffect(() => {
        if (reduced) {
            // Reduced motion can flip on mid-typing. Rather than bailing out of
            // the effect (which would leave the previous run's partial state on
            // screen forever), settle the display to the fully-typed end state.
            setLines([...HERO_LINES])
            setDone(true)
            return undefined
        }

        // Boot screen (Task 8) owns the page until it hands off via `started`.
        // Without this guard the scripted typing would race the boot overlay
        // and finish invisibly behind it.
        if (!started) return undefined

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
    }, [reduced, started])

    const runCommand = (raw) => {
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
            const link = document.createElement("a")
            link.href = "/Aiman_Naim_Resume.pdf"
            link.download = "Aiman_Naim_Resume.pdf"
            link.click()
        } else {
            entry.error = true
            entry.result = `command not found: ${payload || "(empty)"}`
        }

        setHistory((h) => [...h, entry])
        setDraft("")
    }

    return (
        <section className="min-h-[92vh] flex flex-col items-center justify-center pt-32 pb-10 text-center px-6">
            <div className="w-full max-w-[760px]" ref={windowRef}>
                <PixelWindow size="lg" glow title="aiman@root: ~/portfolio$ ./run.sh">
                    <div className="px-6 py-[26px] text-left min-h-[240px]">
                        <div className="font-pixel text-[clamp(16px,3vw,24px)] text-term-text mb-1.5">
                            AIMAN NAIM
                        </div>
                        <div className="font-mono text-[15px] text-acc-purple mb-5 tracking-[0.04em]">
                            {"// full stack software engineer"}
                        </div>

                        {/*
                            role="group" is required for aria-label to apply here — a bare
                            <div> is a generic element and accessible-name computation
                            forbids naming it, which would make the label inert.

                            The scripted lines below are NOT wrapped in aria-live: that
                            would make a screen reader announce the terminal
                            character-by-character as it types. Only the command HISTORY
                            (typed by the user) gets its own aria-live="polite" region, so
                            results are announced without re-narrating the scripted intro.
                        */}
                        <div role="group" aria-label="terminal output">
                            {lines.map((line, i) => (
                                // Array index is a safe key: this list is append-only and
                                // fixed-length, entries are never reordered, inserted, or removed.
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
                                    // Same append-only rationale as above; clear() replaces the
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
                                    className="flex-1 bg-transparent border-0 outline-none font-mono text-[15px] text-term-text caret-acc-green"
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

                <div className="flex gap-3.5 flex-wrap justify-center mt-[26px]">
                    <button type="button" className="btn btn-primary" onClick={() => runCommand("career")}>
                        ▶ VIEW_CAREER
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => runCommand("projects")}>
                        📁 VIEW_PROJECTS
                    </button>
                </div>
            </div>
        </section>
    )
}

Hero.propTypes = {
    onNavigate: PropTypes.func.isRequired,
    // Gates the scripted typing effect: false while the Task 8 boot screen is
    // still covering the page, true once it hands off. Defaults to true so
    // Hero still types normally if rendered standalone (e.g. in tests).
    started: PropTypes.bool,
    // Ref to the wrapper around PixelWindow, exposed so BootScreen can
    // measure this terminal's on-screen rect for the FLIP morph.
    windowRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any }),
    ]),
}

export default Hero
