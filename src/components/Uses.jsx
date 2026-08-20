import PropTypes from "prop-types"
import { motion } from "framer-motion"
import useReducedMotion from "../hooks/useReducedMotion"
import { RiReactjsLine } from "react-icons/ri"
import { SiMongodb, SiRedux, SiJavascript, SiPostman, SiTypescript, SiGooglecloud } from "react-icons/si"
import { FaNodeJs, FaBootstrap, FaGitAlt, FaDocker, FaGithub, FaAngular } from "react-icons/fa"
import { BiLogoPostgresql } from "react-icons/bi"
import { FaLaptop, FaKeyboard, FaComputerMouse, FaHeadphones } from "react-icons/fa6"
import useCodeStats from "../hooks/useCodeStats"
import PixelWindow from "./PixelWindow"

const BLOCK_LABEL = "font-pixel text-label text-term-muted tracking-[0.08em]"

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

// Single row: 120px name column, .stat-track fill bar, right-aligned 76px XP column.
const StatBar = ({ label, xp, pct, tone }) => {
    const reduced = useReducedMotion()
    const width = `${Math.max(pct, 3)}%`

    return (
        <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-term-muted w-[120px] shrink-0 truncate">{label}</span>
            <div className="stat-track">
                <motion.div
                    className={`stat-fill ${tone === "hp" ? "is-hp" : tone === "mp" ? "is-mp" : ""}`}
                    initial={reduced ? false : { width: 0 }}
                    animate={{ width }}
                    transition={{ duration: reduced ? 0 : 1, ease: "easeOut" }}
                />
            </div>
            <span className="font-mono text-xs text-term-muted w-[76px] text-right shrink-0 tabular-nums">
                {xp.toLocaleString()} XP
            </span>
        </div>
    )
}

StatBar.propTypes = {
    label: PropTypes.string.isRequired,
    xp: PropTypes.number.isRequired,
    pct: PropTypes.number.isRequired,
    tone: PropTypes.oneOf(["hp", "mp"]),
}

const xpItemShape = PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, xp: PropTypes.number })
)

// Language / machine XP bars — width relative to the top entry's XP.
const StatsBlock = ({ items, loading, error }) => {
    if (loading) return <p className="font-mono text-xs text-term-muted">LOADING STATS...</p>
    if (error) return <p className="font-mono text-xs text-acc-red">COULD NOT REACH CODESTATS.NET</p>
    if (items.length === 0) return <p className="font-mono text-xs text-term-muted">NO DATA</p>

    return (
        <div className="flex flex-col gap-2">
            {items.map(({ name, xp }) => (
                <StatBar
                    key={name}
                    label={name}
                    xp={xp}
                    pct={items[0].xp > 0 ? Math.max(Math.round((xp / items[0].xp) * 100), 3) : 3}
                />
            ))}
        </div>
    )
}

StatsBlock.propTypes = {
    items: xpItemShape.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.bool,
}

const Uses = () => {
    const { langs, machines, hp, mp, loading, error } = useCodeStats()

    return (
        <div className="flex flex-col gap-4">
            {/* Tools I use — looping belt */}
            <PixelWindow innerClassName="p-4 sm:p-6">
                <p className={`${BLOCK_LABEL} mb-4`}>TOOLS I USE</p>
                <div className="tools-marquee">
                    <div className="tools-track">
                        {[...TOOLS, ...TOOLS].map(({ icon: Icon, color, label }, i) => (
                            <div
                                key={`${label}-${i}`}
                                className="font-mono text-xs px-4 py-2.5 bg-term-panel2 border-2 border-term-outline text-term-text whitespace-nowrap flex items-center gap-2 flex-shrink-0"
                            >
                                <Icon className={`text-base ${color}`} />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </PixelWindow>

            {/* Code::Stats — live HP/MP */}
            <PixelWindow innerClassName="p-4 sm:p-6 flex flex-col gap-4">
                <p className={BLOCK_LABEL}>CODE::STATS — LIVE</p>
                <p className="font-mono text-xs text-term-muted">
                    Source:{" "}
                    <a
                        href="https://codestats.net/users/aimxnaim"
                        target="_blank"
                        rel="noreferrer"
                        className="text-acc-green hover:underline"
                    >
                        codestats.net/users/aimxnaim
                    </a>
                </p>
                {loading && <p className="font-mono text-xs text-term-muted">LOADING STATS...</p>}
                {error && <p className="font-mono text-xs text-acc-red">COULD NOT REACH CODESTATS.NET</p>}
                {!loading && !error && (
                    <div className="flex flex-col gap-2">
                        <StatBar label="HP" xp={hp?.xp ?? 0} pct={hp?.pct ?? 0} tone="hp" />
                        <StatBar label="MP" xp={mp?.xp ?? 0} pct={mp?.pct ?? 0} tone="mp" />
                    </div>
                )}
            </PixelWindow>

            {/* Language proficiency */}
            <PixelWindow innerClassName="p-4 sm:p-6">
                <p className={`${BLOCK_LABEL} mb-4`}>LANGUAGE PROFICIENCY</p>
                <StatsBlock items={langs} loading={loading} error={error} />
            </PixelWindow>

            {/* Time by machine */}
            <PixelWindow innerClassName="p-4 sm:p-6">
                <p className={`${BLOCK_LABEL} mb-4`}>TIME BY MACHINE</p>
                <StatsBlock items={machines} loading={loading} error={error} />
            </PixelWindow>

            {/* Hardware setup */}
            <PixelWindow innerClassName="p-4 sm:p-6">
                <p className={`${BLOCK_LABEL} mb-4`}>HARDWARE SETUP</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {GEAR.map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="bg-term-panel2 border-2 border-term-outline p-4 text-center font-mono text-xs"
                        >
                            <Icon className="text-2xl text-acc-green mx-auto mb-2" />
                            <span className="text-term-muted">{label}</span>
                        </div>
                    ))}
                </div>
            </PixelWindow>
        </div>
    )
}

export default Uses
