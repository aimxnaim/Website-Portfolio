import PropTypes from "prop-types"
import { motion } from "framer-motion"
import { RiReactjsLine } from "react-icons/ri"
import { SiMongodb, SiRedux, SiJavascript, SiPostman, SiTypescript, SiGooglecloud } from "react-icons/si"
import { FaNodeJs, FaBootstrap, FaGitAlt, FaDocker, FaGithub, FaAngular } from "react-icons/fa"
import { BiLogoPostgresql } from "react-icons/bi"
import { FaLaptop, FaKeyboard, FaComputerMouse, FaHeadphones } from "react-icons/fa6"
import useCodeStats from "../hooks/useCodeStats"

const TOOLS = [
    { icon: SiTypescript,     color: "text-blue-400",    label: "TypeScript" },
    { icon: SiJavascript,     color: "text-yellow-400",  label: "JavaScript" },
    { icon: RiReactjsLine,    color: "text-cyan-400",    label: "React" },
    { icon: FaAngular,        color: "text-red-500",     label: "Angular" },
    { icon: FaNodeJs,         color: "text-green-500",   label: "Node.js" },
    { icon: SiMongodb,        color: "text-green-400",   label: "MongoDB" },
    { icon: BiLogoPostgresql, color: "text-cyan-400",    label: "PostgreSQL" },
    { icon: SiRedux,          color: "text-purple-500",  label: "Redux" },
    { icon: FaDocker,         color: "text-sky-400",     label: "Docker" },
    { icon: SiGooglecloud,    color: "text-blue-400",    label: "GCP" },
    { icon: FaGithub,         color: "text-neutral-200", label: "GitHub" },
    { icon: FaGitAlt,         color: "text-red-500",     label: "Git" },
    { icon: FaBootstrap,      color: "text-purple-600",  label: "Bootstrap" },
    { icon: SiPostman,        color: "text-orange-500",  label: "Postman" },
]

const GEAR = [
    { icon: FaLaptop,        label: "MacBook Air M5" },
    { icon: FaHeadphones,    label: "AirPods Pro 2" },
    { icon: FaKeyboard,      label: "RK RK61" },
    { icon: FaComputerMouse, label: "Razer DeathAdder" },
]

const XpBars = ({ items, maxXp }) => (
    <div className="flex flex-col gap-3">
        {items.map(({ name, xp }, i) => {
            const pct = Math.round((xp / maxXp) * 100)
            return (
                <motion.div
                    key={name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                >
                    <span className="pixel-font text-[7px] text-neutral-400 w-28 shrink-0 truncate">{name}</span>
                    <div className="flex-1 h-2 bg-neutral-800 border border-neutral-700 relative overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="h-full bg-gold-400/70"
                        />
                    </div>
                    <span className="pixel-font text-[6px] text-gold-400/60 w-20 text-right shrink-0">
                        {xp.toLocaleString()} XP
                    </span>
                </motion.div>
            )
        })}
    </div>
)

const xpItemShape = PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, xp: PropTypes.number })
)

XpBars.propTypes = {
    items: xpItemShape.isRequired,
    maxXp: PropTypes.number.isRequired,
}

const StatsBlock = ({ title, items, loading, error }) => (
    <div>
        <p className="pixel-font text-[7px] text-gold-400/50 mb-4 tracking-widest">{title}</p>
        {loading && (
            <p className="pixel-font text-[7px] text-neutral-500 text-center py-4 animate-pulse">LOADING STATS...</p>
        )}
        {error && (
            <p className="pixel-font text-[7px] text-red-400/60 text-center py-4">FAILED TO LOAD STATS</p>
        )}
        {!loading && !error && items.length > 0 && (
            <XpBars items={items} maxXp={items[0].xp || 1} />
        )}
    </div>
)

StatsBlock.propTypes = {
    title: PropTypes.string.isRequired,
    items: xpItemShape.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.bool,
}

const Uses = () => {
    const { langs, machines, totalXp, loading, error } = useCodeStats()

    return (
        <div className="pb-4">
            {/* Section header */}
            <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="my-10 text-center flex flex-col items-center gap-3"
            >
                <span className="pixel-font text-[9px] text-gold-400/60 tracking-[0.3em]">◄ EQUIPMENT SCREEN ►</span>
                <h1 className="rpg-font text-5xl lg:text-6xl text-gold-400 tracking-wider">USES &amp; LOADOUT</h1>
                <div className="h-0.5 w-32 bg-gold-400/40" />
            </motion.div>

            <div className="max-w-2xl mx-auto flex flex-col gap-6">
                {/* Tools / equipped skills — looping belt */}
                <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="rpg-panel p-6"
                >
                    <p className="pixel-font text-[7px] text-gold-400/50 tracking-widest mb-4">EQUIPPED TOOLS</p>
                    <div className="marquee">
                        <div className="marquee-track gap-3">
                            {[...TOOLS, ...TOOLS].map(({ icon: Icon, color, label }, i) => (
                                <div
                                    key={`${label}-${i}`}
                                    className="inv-slot p-4 flex flex-col items-center justify-center gap-2 w-24 shrink-0"
                                >
                                    <Icon className={`text-4xl ${color}`} />
                                    <span className="text-[11px] text-neutral-400 text-center leading-tight">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-4 text-center">Hover to pause</p>
                </motion.div>

                {/* Code::Stats — languages + machines */}
                <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="rpg-panel p-6 flex flex-col gap-8"
                >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="pixel-font text-[8px] text-gold-400/70 tracking-widest">CODE::STATS / LIVE</p>
                        {!loading && !error && (
                            <span className="pixel-font text-[7px] text-gold-400/70">TOTAL XP: {totalXp.toLocaleString()}</span>
                        )}
                    </div>

                    <StatsBlock title="LANGUAGE PROFICIENCY" items={langs} loading={loading} error={error} />
                    <StatsBlock title="MACHINE XP" items={machines} loading={loading} error={error} />

                    <a
                        href="https://codestats.net/users/aimxnaim"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pixel-font text-[6px] text-neutral-600 hover:text-gold-400/60 transition-colors text-center"
                    >
                        ► CODE::STATS PROFILE
                    </a>
                </motion.div>

                {/* Gear — placeholder hardware */}
                <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="rpg-panel p-6"
                >
                    <p className="pixel-font text-[7px] text-gold-400/50 mb-4 tracking-widest">GEAR / PHYSICAL LOADOUT</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {GEAR.map(({ icon: Icon, label }) => (
                            <div key={label} className="inv-slot p-4 flex flex-col items-center gap-2">
                                <Icon className="text-3xl text-gold-400/80" />
                                <span className="text-[11px] text-neutral-400 text-center leading-tight">{label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Uses
