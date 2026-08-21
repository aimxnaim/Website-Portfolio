import { useRef } from "react"
import PropTypes from "prop-types"
import PixelWindow from "./PixelWindow"
import useTypewriter from "../hooks/useTypewriter"
import useReducedMotion from "../hooks/useReducedMotion"
import useMediaQuery from "../hooks/useMediaQuery"
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
    "max-lg:w-auto max-lg:flex-shrink-0 max-lg:whitespace-nowrap lg:w-full font-mono text-xs px-3 py-2 border-2 border-term-outline shadow-[2px_2px_0_#000] flex items-center gap-2.5 text-left transition-colors"

const Rail = ({ active, onTabChange }) => {
    const reduced = useReducedMotion()
    const btnRefs = useRef({})
    const isDesktop = useMediaQuery("(min-width: 1024px)")

    const role = useTypewriter({ words: ROLE_WORDS, loop: true, enabled: !reduced })

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
                    <img
                        src={logo}
                        alt="Aiman Naim"
                        className="w-24 h-24 object-cover border-2 border-black"
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
            <PixelWindow size="sm" title="nav.sys" className="w-full order-2 lg:order-none sticky top-[var(--taskbar-h)] z-20 lg:static" innerClassName="p-2">
                <nav
                    role="tablist"
                    aria-label="content sections"
                    aria-orientation={isDesktop ? "vertical" : "horizontal"}
                    className="flex max-lg:flex-row max-lg:overflow-x-auto lg:flex-col gap-1.5"
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
            <div className="w-full flex flex-col gap-5 order-4 lg:order-none">
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
