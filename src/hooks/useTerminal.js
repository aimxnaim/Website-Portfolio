import { useCallback, useEffect, useState } from "react"
import { parseCommand, COMMANDS } from "../lib/terminalCommands"
import { downloadResume } from "../lib/resume"
import useReducedMotion from "./useReducedMotion"

// Deliberately NOT the job title, employer, or mission — profile.dat in the
// rail and the system.log ticker already carry all three, and repeating them
// here made the terminal read as a third copy of the same paragraph. This is
// the off-the-clock half of the person instead: the part nothing else on the
// page says.
export const TERMINAL_LINES = [
    { prompt: "$ hobbies --list",  result: "coding (always) · mobile legends, roamer — the healer and guardian · gym" },
    { prompt: "$ learning --now",  result: "aws certified solutions architect – associate, in progress" },
    { prompt: "$ status",          result: "open to interesting problems ✓" },
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
