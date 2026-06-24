import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaBriefcase, FaGraduationCap, FaFolderOpen, FaCogs } from "react-icons/fa"
import CareerSection from "./CareerSection"
import Education from "./Education"
import Projects from "./Projects"
import Uses from "./Uses"

const tabs = [
    { id: "career",    label: "QUEST LOG",    shortLabel: "CAREER",  icon: FaBriefcase,     component: CareerSection },
    { id: "education", label: "ORIGIN STORY", shortLabel: "ORIGIN",  icon: FaGraduationCap, component: Education },
    { id: "projects",  label: "ACHIEVEMENTS", shortLabel: "ACHIEVE", icon: FaFolderOpen,    component: Projects },
    { id: "uses",      label: "EQUIPMENT",    shortLabel: "USES",    icon: FaCogs,          component: Uses },
]

const ContentPanel = () => {
    const [active, setActive] = useState("career")
    const ActiveComponent = tabs.find((t) => t.id === active)?.component || CareerSection

    return (
        <div className="flex-1 min-w-0">
            {/* Top nav */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
                {tabs.map(({ id, label, shortLabel, icon: Icon }) => {
                    const isActive = id === active
                    return (
                        <motion.button
                            key={id}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setActive(id)}
                            className={`rpg-menu-btn flex items-center gap-2 px-4 py-2.5 ${isActive ? "active" : ""}`}
                        >
                            {isActive && <span className="text-rpg-bg text-xs">►</span>}
                            <Icon className={isActive ? "text-rpg-bg" : "text-neutral-500"} />
                            <span className="hidden sm:block">{label}</span>
                            <span className="sm:hidden">{shortLabel}</span>
                        </motion.button>
                    )
                })}
            </div>

            {/* Panel */}
            <div className="rpg-panel w-full p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4 border-b border-gold-400/20 pb-3">
                    <span className="w-2 h-2 bg-gold-400 inline-block" />
                    <span className="pixel-font text-[8px] text-gold-400/70 tracking-widest">
                        {tabs.find((t) => t.id === active)?.label}
                    </span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ActiveComponent />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ContentPanel
