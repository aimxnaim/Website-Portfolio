import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import PixelWindow from "./PixelWindow"
import useMediaQuery from "../hooks/useMediaQuery"
import { COMMANDS } from "../lib/terminalCommands"
import { ABOUT_LEAD, ABOUT_PARAGRAPHS } from "../constants"

// 900px covers iPad portrait and landscape phones. Below it the text input
// is truly absent from the DOM (not merely CSS-hidden), so tapping cannot
// summon the OS keyboard over the content.
const DESKTOP_QUERY = "(min-width: 900px)"

// "Fri Aug 21 09:14" — the stamp a real shell prints above the first prompt.
// It stands in for the name/role heading this terminal used to carry, which
// only repeated what profile.dat in the rail already says.
const loginStamp = () =>
    new Date().toLocaleString("en-US", {
        weekday: "short", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: false,
    }).replace(",", "")

const AboutPanel = ({ lines, done, history, draft, setDraft, runCommand, windowRef }) => {
    const isDesktop = useMediaQuery(DESKTOP_QUERY)
    const firstRun = useRef(true)
    const inputRef = useRef(null)

    // Purely presentational, so it stays here rather than in useTerminal:
    // it only decides whether the fake block cursor or the real caret is
    // the one being shown.
    const [focused, setFocused] = useState(false)

    // The input is a 1-line transparent strip — an easy target to miss.
    // Clicking anywhere on the screen focuses it, the way clicking a real
    // terminal window does. Guarded on the selection so dragging to copy
    // a line of output doesn't collapse it by stealing focus.
    const focusInput = () => {
        if (window.getSelection()?.toString()) return
        inputRef.current?.focus()
    }

    // Text typed before narrowing the viewport would otherwise persist in
    // state with no visible field, and reappear if the viewport widens.
    // Skip the mount run: `draft` is lifted into App so it survives a tab
    // switch (AboutPanel unmounts/remounts on every switch), and without
    // the guard this effect would wipe it right back out on remount.
    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false
            return
        }
        setDraft("")
    }, [isDesktop, setDraft])

    return (
        <div className="flex flex-col gap-6">
            <div ref={windowRef}>
                <PixelWindow size="lg" glow title="aiman@root: ~/about" innerClassName="term-screen">
                    {/*
                        Not a button/role=button: the input inside is already
                        in the tab order, so making the wrapper interactive
                        would add a phantom stop for keyboard and screen-reader
                        users to buy a convenience only a mouse can use.
                    */}
                    <div
                        className={`px-5 py-6 sm:px-6 text-left min-h-[220px] ${isDesktop && done ? "cursor-text" : ""}`}
                        onClick={isDesktop && done ? focusInput : undefined}
                    >
                        <div className="font-mono text-xs text-term-muted/70 mb-5 pb-3 border-b border-acc-green/15">
                            last login: {loginStamp()} on ttys001
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

                            {/*
                                Desktop drops this line: styled as term-result
                                it read as more scripted output rather than an
                                instruction, and the input's placeholder now
                                says the same thing where the typing happens.
                                Mobile has no input, so it stays as the framing
                                for the button row below.
                            */}
                            {done && !isDesktop && (
                                <div className="term-line term-result">
                                    {"tap a command to run it"}
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

                                {/*
                                    Stands in for the caret while the field is
                                    idle — the real one only appears once you
                                    have already clicked in, which is too late
                                    to be the thing that tells you to.

                                    Hidden rather than unmounted the moment
                                    focus or text makes a second cursor
                                    visible: unmounting it collapses its
                                    ~11px of layout and jolts the whole line
                                    leftward on click.
                                */}
                                <span
                                    className={`term-cursor ${focused || draft ? "invisible" : ""}`}
                                    aria-hidden="true"
                                />

                                {/*
                                    Placeholder sits at /75 rather than a
                                    fainter dim: over the near-black screen
                                    anything below it falls under 4.5:1, and
                                    this is the main thing telling you the
                                    terminal takes input.
                                */}
                                <input
                                    ref={inputRef}
                                    id="term-input"
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onFocus={() => setFocused(true)}
                                    onBlur={() => setFocused(false)}
                                    placeholder="type a command — try 'help'"
                                    autoComplete="off"
                                    spellCheck="false"
                                    aria-label="Terminal command input"
                                    className="flex-1 bg-transparent border-0 outline-none font-mono text-sm text-term-text caret-acc-green placeholder:text-term-muted/75"
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

            {/* Capped at 68ch. The content panel runs past 900px on a desktop
                and prose that wide is measurably harder to track line to line —
                the terminal above can fill the width, this can't. */}
            <div className="flex flex-col gap-4 max-w-[68ch]">
                <p className="font-sans text-lg text-term-text leading-relaxed border-l-[3px] border-acc-green pl-4">
                    {ABOUT_LEAD}
                </p>
                {ABOUT_PARAGRAPHS.map((para) => (
                    <p key={para} className="font-sans text-base text-term-muted">
                        {para}
                    </p>
                ))}
            </div>
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
