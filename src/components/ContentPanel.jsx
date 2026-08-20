import { useRef } from "react"
import PropTypes from "prop-types"
import { motion, AnimatePresence } from "framer-motion"
import PixelWindow from "./PixelWindow"
import CareerSection from "./CareerSection"
import Education from "./Education"
import Projects from "./Projects"
import Uses from "./Uses"
import useReducedMotion from "../hooks/useReducedMotion"

// CRITICAL: the tech-stack tab id is "stack", not "uses". Taskbar's NAV
// array and terminalCommands' TABS array both key off "stack" — keep this
// in sync or the taskbar link / terminal command will silently do nothing.
const TABS = [
    { id: "career",    emoji: "💼", label: "CAREER",    Component: CareerSection },
    { id: "education", emoji: "🎓", label: "EDUCATION", Component: Education },
    { id: "projects",  emoji: "📁", label: "PROJECTS",  Component: Projects },
    { id: "stack",     emoji: "🛠", label: "STACK",      Component: Uses },
]

const TITLES = {
    career: "aiman@root: ~/career.log",
    education: "aiman@root: ~/education.log",
    projects: "aiman@root: ~/projects",
    stack: "aiman@root: ~/stack.log",
}

const TAB_BASE =
    "font-mono text-[13px] px-4 py-2.5 border-2 border-term-outline shadow-[2px_2px_0_#000] flex items-center gap-2 transition-colors"

const ContentPanel = ({ active, onTabChange }) => {
    const btnRefs = useRef({})
    const reduced = useReducedMotion()

    const activeTab = TABS.find((t) => t.id === active) || TABS[0]
    const ActiveComponent = activeTab.Component

    const focusTabAt = (index) => {
        const id = TABS[index].id
        btnRefs.current[id]?.focus()
    }

    const handleKeyDown = (event, index) => {
        let nextIndex = null

        if (event.key === "ArrowRight") nextIndex = (index + 1) % TABS.length
        else if (event.key === "ArrowLeft") nextIndex = (index - 1 + TABS.length) % TABS.length
        else if (event.key === "Home") nextIndex = 0
        else if (event.key === "End") nextIndex = TABS.length - 1
        else return

        event.preventDefault()
        onTabChange(TABS[nextIndex].id)
        focusTabAt(nextIndex)
    }

    return (
        <div className="flex-1 min-w-0 w-full">
            <div
                role="tablist"
                aria-label="content sections"
                className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6"
            >
                {TABS.map(({ id, emoji, label }, index) => {
                    const isActive = id === active
                    return (
                        <button
                            key={id}
                            ref={(el) => {
                                btnRefs.current[id] = el
                            }}
                            type="button"
                            role="tab"
                            id={`tab-${id}`}
                            aria-selected={isActive}
                            aria-controls={isActive ? `panel-${id}` : undefined}
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => onTabChange(id)}
                            onKeyDown={(event) => handleKeyDown(event, index)}
                            className={`${TAB_BASE} ${isActive ? "bg-acc-green text-[#1e1f29]" : "bg-term-panel2"}`}
                        >
                            <span className={isActive ? "" : "opacity-0"} aria-hidden="true">►</span>
                            <span aria-hidden="true">{emoji}</span>
                            <span>{label}</span>
                        </button>
                    )
                })}
            </div>

            <PixelWindow title={TITLES[activeTab.id]} className="w-full">
                <div
                    role="tabpanel"
                    id={`panel-${activeTab.id}`}
                    aria-labelledby={`tab-${activeTab.id}`}
                    className="p-4 sm:p-6"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab.id}
                            initial={reduced ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                            transition={{ duration: reduced ? 0 : 0.2 }}
                        >
                            <ActiveComponent />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </PixelWindow>
        </div>
    )
}

ContentPanel.propTypes = {
    active: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
}

export default ContentPanel
