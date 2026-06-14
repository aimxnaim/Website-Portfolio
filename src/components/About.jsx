import aboutImg from '../assets/IMG_8211.jpg'
import { ABOUT_TEXT } from '../constants/index'
import { motion } from "framer-motion"

const STATS = [
    { id: 'STR', label: 'Problem Solving', color: 'bar-str', pct: 88 },
    { id: 'INT', label: 'Learning Speed',  color: 'bar-int', pct: 92 },
    { id: 'DEX', label: 'Code Quality',    color: 'bar-dex', pct: 85 },
    { id: 'WIS', label: 'System Design',   color: 'bar-wis', pct: 78 },
    { id: 'CHA', label: 'Collaboration',   color: 'bar-cha', pct: 90 },
    { id: 'LCK', label: 'Curiosity',       color: 'bar-lck', pct: 95 },
]

const StatBar = ({ id, label, color, pct }) => (
    <motion.div
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex items-center gap-3"
    >
        <span className="pixel-font text-[8px] text-gold-400 w-8 flex-shrink-0">{id}</span>
        <div className="flex-1 stat-bar-track">
            <motion.div
                className={`stat-bar-fill ${color}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
                viewport={{ once: true }}
            />
        </div>
        <span className="rpg-font text-lg text-neutral-400 w-8 text-right">{pct}</span>
        <span className="text-xs text-neutral-600 hidden sm:block w-28">{label}</span>
    </motion.div>
)

const About = () => {
    return (
        <div id="about" className="border-b-2 border-gold-400/15 pb-12">
            {/* Section header */}
            <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="my-12 text-center flex flex-col items-center gap-3"
            >
                <span className="pixel-font text-[9px] text-gold-400/60 tracking-[0.3em]">◄ PARTY MEMBER INFO ►</span>
                <h1 className="rpg-font text-5xl lg:text-6xl text-gold-400 tracking-wider">CHARACTER STATS</h1>
                <div className="h-0.5 w-32 bg-gold-400/40" />
            </motion.div>

            <div className="flex flex-wrap gap-8 items-start">
                {/* Left: Portrait card */}
                <motion.div
                    whileInView={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="w-full lg:w-5/12"
                >
                    <div className="rpg-panel p-3 mx-auto max-w-xs lg:max-w-none">
                        {/* Portrait label */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="pixel-font text-[7px] text-gold-400/60">PORTRAIT</span>
                            <span className="pixel-font text-[7px] text-green-400">♥ ALLY</span>
                        </div>
                        <img
                            src={aboutImg}
                            alt="Aiman Naim"
                            className="w-full object-cover"
                            style={{ maxHeight: '360px', objectPosition: 'top' }}
                        />
                        {/* Name plate */}
                        <div className="mt-2 border-t border-gold-400/30 pt-2 text-center">
                            <p className="rpg-font text-2xl text-gold-400">AIMAN NAIM</p>
                            <p className="pixel-font text-[7px] text-neutral-500 mt-1">FULL STACK DEVELOPER · LV.24</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Stats + dialog */}
                <motion.div
                    whileInView={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: 60 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex-1 min-w-0 flex flex-col gap-6"
                >
                    {/* Base stats */}
                    <div className="rpg-panel-dim p-5">
                        <p className="pixel-font text-[8px] text-gold-400/70 tracking-widest mb-4">BASE STATS</p>
                        <div className="flex flex-col gap-3">
                            {STATS.map((s) => (
                                <StatBar key={s.id} {...s} />
                            ))}
                        </div>

                        {/* EXP bar */}
                        <div className="mt-5 border-t border-gold-400/15 pt-4">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="pixel-font text-[7px] text-gold-400/60">EXP</span>
                                <span className="pixel-font text-[7px] text-neutral-500">2 YRS / MAX</span>
                            </div>
                            <div className="stat-bar-track">
                                <motion.div
                                    className="stat-bar-fill bar-exp"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '82%' }}
                                    transition={{ duration: 1.6, ease: 'easeOut', delay: 0.4 }}
                                    viewport={{ once: true }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dialog box / about text */}
                    <div className="dialog-box">
                        <p className="pixel-font text-[7px] text-gold-400/60 tracking-widest mb-3">BIO</p>
                        <p className="rpg-font text-xl text-neutral-300 leading-relaxed">{ABOUT_TEXT}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default About
