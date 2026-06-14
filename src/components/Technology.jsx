import { RiReactjsLine } from "react-icons/ri"
import { SiMongodb, SiRedux, SiJavascript, SiPostman } from "react-icons/si"
import { FaNodeJs, FaBootstrap, FaGitAlt } from "react-icons/fa"
import { BiLogoPostgresql } from "react-icons/bi"
import { motion } from "framer-motion"

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
        </div>
    )
}

export default Technology
