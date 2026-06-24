import { RiReactjsLine } from "react-icons/ri"
import { SiMongodb, SiRedux, SiJavascript, SiPostman } from "react-icons/si"
import { FaNodeJs, FaBootstrap, FaGitAlt } from "react-icons/fa"
import { BiLogoPostgresql } from "react-icons/bi"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const IGNORED_LANGS = new Set(['scminput', 'Plain text', 'Log', 'chatagent', 'Ignore', 'Properties', 'DotEnv'])

function useCodeStats() {
    const [data, setData] = useState({ langs: [], totalXp: 0, loading: true, error: false })

    useEffect(() => {
        fetch('https://codestats.net/api/users/aimxnaim')
            .then(r => r.json())
            .then(json => {
                const langs = Object.entries(json.languages)
                    .filter(([name]) => !IGNORED_LANGS.has(name))
                    .map(([name, info]) => ({ name, xp: info.xps }))
                    .sort((a, b) => b.xp - a.xp)
                    .slice(0, 10)
                setData({ langs, totalXp: json.total_xp, loading: false, error: false })
            })
            .catch(() => setData(d => ({ ...d, loading: false, error: true })))
    }, [])

    return data
}

const SKILLS = [
    { icon: RiReactjsLine,     color: 'text-cyan-400',    label: 'React',      type: 'WEAPON' },
    { icon: SiMongodb,         color: 'text-green-400',   label: 'MongoDB',    type: 'ITEM' },
    { icon: FaNodeJs,          color: 'text-green-500',   label: 'Node.js',    type: 'WEAPON' },
    { icon: SiRedux,           color: 'text-purple-500',  label: 'Redux',      type: 'ARMOR' },
    { icon: BiLogoPostgresql,  color: 'text-cyan-400',    label: 'PostgreSQL', type: 'ITEM' },
    { icon: SiJavascript,      color: 'text-yellow-400',  label: 'JavaScript', type: 'WEAPON' },
    { icon: FaBootstrap,       color: 'text-purple-600',  label: 'Bootstrap',  type: 'ARMOR' },
    { icon: FaGitAlt,          color: 'text-red-500',     label: 'Git',        type: 'TOOL' },
    { icon: SiPostman,         color: 'text-orange-500',  label: 'Postman',    type: 'TOOL' },
]

const TYPE_COLORS = {
    WEAPON: 'text-red-400',
    ARMOR:  'text-blue-400',
    ITEM:   'text-green-400',
    TOOL:   'text-yellow-400',
}

const Technology = () => {
    const { langs, totalXp, loading, error } = useCodeStats()
    const maxXp = langs[0]?.xp || 1

    return (
        <div className="pb-4">
            {/* Section header */}
            <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="my-12 text-center flex flex-col items-center gap-3"
            >
                <span className="pixel-font text-[9px] text-gold-400/60 tracking-[0.3em]">◄ EQUIPMENT SCREEN ►</span>
                <h1 className="rpg-font text-5xl lg:text-6xl text-gold-400 tracking-wider">EQUIPPED SKILLS</h1>
                <div className="h-0.5 w-32 bg-gold-400/40" />
            </motion.div>

            {/* Legend */}
            <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="flex justify-center gap-4 mb-8 flex-wrap"
            >
                {Object.entries(TYPE_COLORS).map(([type, color]) => (
                    <span key={type} className={`pixel-font text-[7px] ${color} flex items-center gap-1`}>
                        <span className="w-2 h-2 rounded-full bg-current inline-block" />
                        {type}
                    </span>
                ))}
            </motion.div>

            {/* Inventory grid */}
            <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="rpg-panel p-6 max-w-2xl mx-auto"
            >
                <p className="pixel-font text-[7px] text-gold-400/50 mb-4 tracking-widest">INVENTORY SLOT 1-9 / EQUIPPED</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {SKILLS.map(({ icon: Icon, color, label, type }, i) => (
                        <motion.div
                            key={label}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                            className="group relative"
                        >
                            <div className="inv-slot p-4 flex flex-col items-center gap-2">
                                <Icon className={`text-4xl ${color}`} />
                                <span className="pixel-font text-[6px] text-neutral-500 text-center leading-tight">{label}</span>
                                {/* Type badge on hover */}
                                <span className={`pixel-font text-[5px] ${TYPE_COLORS[type]} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                    {type}
                                </span>
                            </div>
                            {/* Equipped glow corner */}
                            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-green-400 opacity-60" />
                        </motion.div>
                    ))}
                </div>
                <p className="pixel-font text-[7px] text-neutral-600 mt-4 text-center">HOVER SLOT FOR DETAILS</p>
            </motion.div>

            {/* Code::Stats XP section */}
            <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="rpg-panel p-6 max-w-2xl mx-auto mt-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <p className="pixel-font text-[7px] text-gold-400/50 tracking-widest">LANGUAGE PROFICIENCY / LIVE</p>
                    {!loading && !error && (
                        <span className="pixel-font text-[7px] text-gold-400/70">
                            TOTAL XP: {totalXp.toLocaleString()}
                        </span>
                    )}
                </div>

                {loading && (
                    <p className="pixel-font text-[7px] text-neutral-500 text-center py-4 animate-pulse">
                        LOADING STATS...
                    </p>
                )}

                {error && (
                    <p className="pixel-font text-[7px] text-red-400/60 text-center py-4">
                        FAILED TO LOAD STATS
                    </p>
                )}

                {!loading && !error && (
                    <div className="flex flex-col gap-3">
                        {langs.map(({ name, xp }, i) => {
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
                                            transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
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
                )}

                <a
                    href="https://codestats.net/users/aimxnaim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-font text-[6px] text-neutral-600 hover:text-gold-400/60 transition-colors mt-4 block text-center"
                >
                    ► CODE::STATS PROFILE
                </a>
            </motion.div>
        </div>
    )
}

export default Technology
