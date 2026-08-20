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
