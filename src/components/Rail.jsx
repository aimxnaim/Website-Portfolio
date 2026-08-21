import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import PixelWindow from "./PixelWindow"
import PixelIcon from "./PixelIcon"
import useTypewriter from "../hooks/useTypewriter"
import useReducedMotion from "../hooks/useReducedMotion"
import useMediaQuery from "../hooks/useMediaQuery"
import { liveAge } from "../lib/clock"
import { TAB_IDS, tabButtonId, tabPanelId } from "../lib/tabs"
import logo from "../assets/aiman.jpg"
import photo from "../assets/aiman-profile-pic.jpg"

const ROLE_WORDS = [
    "Full Stack Developer", "Front End Developer", "Back End Developer",
    "Coder", "Programmer", "Software Engineer", "Tech Enthusiast",
]

// Must cover every id in TAB_IDS. Render order comes from TAB_IDS, not from
// this object, so the rail and the panel can never disagree. The icon is drawn
// from the id, see PixelIcon.
const NAV_META = {
    about:     { label: "ABOUT" },
    career:    { label: "CAREER" },
    education: { label: "EDUCATION" },
    projects:  { label: "PROJECTS" },
    stack:     { label: "STACK" },
}

// Only the selected row wears the chunky black border + hard shadow. Giving
// every row that frame — the previous treatment — meant five competing slabs
// and no visible hierarchy, so the active state had to shout with a full green
// fill to be seen at all. Inactive rows sit flat on the panel and the border is
// transparent rather than absent, so promoting one shifts nothing.
const NAV_BASE =
    "group max-lg:w-auto max-lg:flex-shrink-0 max-lg:whitespace-nowrap lg:w-full font-mono text-xs px-2.5 py-2 border-2 flex items-center gap-2.5 text-left transition-colors duration-150"

const NAV_STATE = {
    active: "relative z-10 border-term-outline bg-acc-green text-[#1e1f29] shadow-[3px_3px_0_#000]",
    idle: "border-transparent bg-transparent text-term-muted hover:border-term-outline hover:bg-term-panel2 hover:text-acc-green",
}

const Rail = ({ active, onTabChange, booted }) => {
    const reduced = useReducedMotion()
    const btnRefs = useRef({})
    const isDesktop = useMediaQuery("(min-width: 1024px)")
    // Click/tap toggle for the avatar. Hover is pure CSS; this only exists so
    // touch and keyboard can reach the back face.
    const [flipped, setFlipped] = useState(false)
    const [peeking, setPeeking] = useState(false)

    const role = useTypewriter({ words: ROLE_WORDS, loop: true, enabled: !reduced })

    // Wait for `booted` rather than timing from mount: the rail renders under
    // the boot overlay, so a mount-relative delay would spend the nudge on a
    // covered card. The pause after gives the panel a moment to settle first.
    useEffect(() => {
        if (!booted || reduced) return
        const timer = setTimeout(() => setPeeking(true), 1200)
        return () => clearTimeout(timer)
    }, [booted, reduced])

    // Any real interaction retires the nudge for good — the hint has landed,
    // and a running animation would otherwise outrank the hover transition.
    const endPeek = () => setPeeking(false)

    const handleKeyDown = (event, index) => {
        let nextIndex = null

        // Below `lg` the nav is a horizontal chip row (Left/Right); at `lg`
        // it's a vertical stack (Up/Down). Both axes are accepted at every
        // width so the handler doesn't need to branch on isDesktop.
        if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % TAB_IDS.length
        else if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + TAB_IDS.length) % TAB_IDS.length
        else if (event.key === "Home") nextIndex = 0
        else if (event.key === "End") nextIndex = TAB_IDS.length - 1
        else return

        event.preventDefault()
        const nextId = TAB_IDS[nextIndex]
        onTabChange(nextId)
        btnRefs.current[nextId]?.focus()
    }

    return (
        <aside className="contents lg:flex lg:flex-col lg:gap-5 lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-[var(--rail-top)] lg:self-start">
            {/* Block 1 — identity */}
            <PixelWindow title="profile.dat" className="w-full order-1 lg:order-none" innerClassName="p-3 sm:p-4 flex flex-col gap-4">
                <div className="relative mx-auto w-24 h-24">
                    {/* A button, not a hover-only div: pointerless input (touch,
                        keyboard) needs a way to turn the card over too. Both faces
                        are alt="" — the name and role right below already carry
                        the identity, so alt text here would only repeat it. */}
                    <button
                        type="button"
                        onClick={() => { endPeek(); setFlipped((f) => !f) }}
                        onPointerEnter={endPeek}
                        onFocus={endPeek}
                        aria-pressed={flipped}
                        aria-label={flipped ? "Show pixel avatar" : "Show photo of Aiman Naim"}
                        className={`avatar-flip ${flipped ? "is-flipped" : ""}`}
                    >
                        <span
                            className={`avatar-flip__inner ${peeking ? "is-peeking" : ""}`}
                            onAnimationEnd={endPeek}
                        >
                            <img src={logo} alt="" className="avatar-flip__face" />
                            <img
                                src={photo}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="avatar-flip__face is-back"
                            />
                        </span>
                    </button>
                    {/* Immediate sibling of the button on purpose — the hover /
                        focus styling hangs off `.avatar-flip:hover + &`. */}
                    <span className="avatar-flip-hint">
                        <PixelIcon name="flip" size={12} />
                    </span>
                    <span className="absolute bottom-[-6px] right-[-6px] z-10 font-pixel text-label bg-acc-green text-[#1e1f29] border-2 border-term-outline px-1.5 py-0.5 leading-none">
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
            <PixelWindow size="sm" title="nav.sys" className="w-full order-2 lg:order-none sticky top-[var(--taskbar-h)] z-20 lg:static" innerClassName="p-2">
                <nav
                    role="tablist"
                    aria-label="content sections"
                    aria-orientation={isDesktop ? "vertical" : "horizontal"}
                    className="flex max-lg:flex-row max-lg:overflow-x-auto lg:flex-col gap-1"
                >
                    {TAB_IDS.map((id, index) => {
                        const { label } = NAV_META[id]
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
                                className={`${NAV_BASE} ${isActive ? NAV_STATE.active : NAV_STATE.idle}`}
                            >
                                {/* The icon inherits the row's text colour, so it
                                    tracks idle / hover / active without extra classes. */}
                                <PixelIcon name={id} />
                                <span className="tracking-wider">{label}</span>
                                {/* Kept in the layout when inactive so labels don't shift. */}
                                <span
                                    aria-hidden="true"
                                    className={`ml-auto pl-3 max-lg:hidden ${isActive ? "" : "opacity-0 group-hover:opacity-40"}`}
                                >
                                    ►
                                </span>
                            </button>
                        )
                    })}
                </nav>

                {/* Arrow-key roving focus is implemented above but undiscoverable. */}
                <p className="max-lg:hidden mt-2 pt-2 border-t-2 border-black/40 px-2.5 font-mono text-label text-term-muted/70">
                    <span className="text-acc-purple">↑↓</span> navigate
                    <span className="mx-1.5 text-term-muted/40">·</span>
                    <span className="text-acc-purple">↵</span> open
                </p>
            </PixelWindow>

            {/* Block 3 — quote + credits. No window: the quote carries its own
                surface and the credits sit on the page background. */}
            <div className="w-full flex flex-col gap-5 order-4 lg:order-none">
                <div className="border-l-[3px] border-acc-purple bg-term-panel2 px-3.5 py-3">
                    <p className="font-pixel text-label text-acc-purple mb-2">WORDS I LIVE BY</p>
                    <p className="font-sans text-sm italic text-term-text leading-relaxed">
                        “So surely with hardships comes ease”
                    </p>
                    <p className="font-mono text-xs text-term-muted mt-2">— Surah Ash-Sharh, Ayat 5</p>
                </div>

                <div className="flex flex-col items-center gap-1 text-center">
                    <p className="font-mono text-xs text-term-muted">Built with React, Tailwind & Vite</p>
                    <p className="font-pixel text-label text-term-muted">© {new Date().getFullYear()} AIMAN NAIM</p>
                </div>
            </div>
        </aside>
    )
}

Rail.propTypes = {
    active: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
    // Gates the avatar's one-time flip nudge so it doesn't play behind the
    // boot overlay. Same signal useTerminal takes as `started`.
    booted: PropTypes.bool,
}

export default Rail
