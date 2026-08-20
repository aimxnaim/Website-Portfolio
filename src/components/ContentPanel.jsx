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
