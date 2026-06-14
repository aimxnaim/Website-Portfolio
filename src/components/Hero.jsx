import { motion } from "framer-motion"
import { Cursor, useTypewriter } from 'react-simple-typewriter'

const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: 'easeOut' } },
})

const STAT_ITEMS = [
    { label: 'YRS EXP',   value: '2+',      icon: '⚔' },
    { label: 'QUESTS',    value: '5+',       icon: '📜' },
    { label: 'SKILLS',    value: 'DIVERSE',  icon: '✨' },
]

const Hero = () => {
    const [text] = useTypewriter({
        words: ['Full Stack Developer', 'Front End Developer', 'Back End Developer', 'Coder', 'Tech Enthusiast'],
        loop: 0,
        deleteSpeed: 50,
        typeSpeed: 60,
    })

    return (
        <div className="border-b-2 border-gold-400/15 pb-12 lg:mb-10">
            {/* Section label */}
            <motion.div
                variants={fadeUp(0)}
                initial="hidden"
                animate="visible"
                className="flex justify-center mb-6"
            >
                <span className="pixel-font text-[9px] text-gold-400/70 tracking-[0.3em] border border-gold-400/25 px-4 py-2 bg-gold-400/5">
                    ◄ STATUS SCREEN ►
                </span>
            </motion.div>

            {/* Main RPG panel */}
            <motion.div
                variants={fadeUp(0.1)}
                initial="hidden"
                animate="visible"
                className="rpg-panel mx-auto max-w-3xl p-8 lg:p-12"
            >
                {/* Character name */}
                <motion.h1
                    variants={fadeUp(0.2)}
                    initial="hidden"
                    animate="visible"
                    className="rpg-font text-center text-6xl lg:text-8xl text-gold-400 tracking-widest mb-2"
                >
                    AIMAN NAIM
                </motion.h1>

                <motion.div
                    variants={fadeUp(0.3)}
                    initial="hidden"
                    animate="visible"
                    className="flex justify-center mb-8"
                >
                    <span className="pixel-font text-[8px] text-neutral-500 tracking-[0.2em]">CHARACTER NAME</span>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="flex-1 h-px bg-gold-400/30" />
                    <span className="text-gold-400/60 text-sm">⚔</span>
                    <div className="flex-1 h-px bg-gold-400/30" />
                </div>

                {/* Class / typewriter */}
                <motion.div
                    variants={fadeUp(0.4)}
                    initial="hidden"
                    animate="visible"
                    className="text-center mb-8"
                >
                    <p className="pixel-font text-[8px] text-neutral-500 tracking-widest mb-3">CLASS</p>
                    <div className="rpg-font text-3xl lg:text-4xl flex items-center justify-center gap-2 flex-wrap">
                        <span className="text-neutral-300">[ </span>
                        <span className="text-gold-400">{text}</span>
                        <Cursor cursorColor="#f0c040" />
                        <span className="text-neutral-300"> ]</span>
                    </div>
                </motion.div>

                {/* Stat blocks */}
                <motion.div
                    variants={fadeUp(0.5)}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-3 gap-3 mt-6"
                >
                    {STAT_ITEMS.map(({ label, value, icon }, i) => (
                        <motion.div
                            key={label}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.3 }}
                            className="rpg-panel-dim p-4 text-center"
                        >
                            <div className="text-xl mb-1">{icon}</div>
                            <div className="rpg-font text-2xl text-gold-400 leading-none">{value}</div>
                            <div className="pixel-font text-[7px] text-neutral-500 mt-1 leading-relaxed">{label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    variants={fadeUp(0.8)}
                    initial="hidden"
                    animate="visible"
                    className="flex justify-center mt-8"
                >
                    <span className="pixel-font text-[8px] text-neutral-600 tracking-widest">
                        ▼ <span className="blink">SCROLL TO CONTINUE</span>
                    </span>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Hero
