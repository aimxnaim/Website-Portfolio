import { useState } from "react"
import PropTypes from "prop-types"
import { motion } from "framer-motion"
import { Cursor, useTypewriter } from "react-simple-typewriter"
import { FaLinkedin, FaGithub, FaInstagram, FaThreads, FaDiscord, FaFilePdf } from "react-icons/fa6"
import logo from "../assets/aiman.jpg"
import useCodeStats from "../hooks/useCodeStats"

const BIRTH_YEAR = 2001
const BIRTH_MONTH = 12 // December (1-indexed)

const liveAge = () => {
    const now = new Date()
    return now.getFullYear() - BIRTH_YEAR - (now.getMonth() + 1 < BIRTH_MONTH ? 1 : 0)
}

const downloadResume = () => {
    const link = document.createElement("a")
    link.href = "/Aiman_Naim_Resume.pdf"
    link.download = "Aiman_Naim_Resume.pdf"
    link.click()
}

const StatBar = ({ id, colorClass, bar }) => (
    <div className="flex items-center gap-2">
        <span className={`pixel-font text-[7px] w-5 ${colorClass}`}>{id}</span>
        <div className="stat-bar-track flex-1">
            <motion.div
                className={`stat-bar-fill ${id === "HP" ? "bar-hp" : "bar-mp"}`}
                initial={{ width: 0 }}
                animate={{ width: bar ? `${Math.max(bar.pct, 4)}%` : "0%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            />
        </div>
        <span className="text-neutral-500 text-[10px] w-14 text-right tabular-nums">
            {bar ? `${bar.xp}` : "—"}
        </span>
    </div>
)

StatBar.propTypes = {
    id: PropTypes.string.isRequired,
    colorClass: PropTypes.string.isRequired,
    bar: PropTypes.shape({ xp: PropTypes.number, pct: PropTypes.number }),
}

const Sidebar = () => {
    const { hp, mp, loading } = useCodeStats()
    const [copied, setCopied] = useState(false)

    const [klass] = useTypewriter({
        words: ["Full Stack Developer", "Front End Developer", "Back End Developer", "Coder", "Programmer", "Software Engineer", "Tech Enthusiast"],
        loop: 0,
        deleteSpeed: 50,
        typeSpeed: 60,
    })

    const copyDiscord = async () => {
        try {
            await navigator.clipboard.writeText("mxxn512")
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        }
    }

    const socials = [
        { Icon: FaLinkedin, label: "LINK", href: "https://www.linkedin.com/in/aimannaimfaizul/", title: "LinkedIn" },
        { Icon: FaGithub, label: "CODE", href: "https://github.com/aimxnaim", title: "GitHub" },
        { Icon: FaInstagram, label: "INSTA", href: "https://www.instagram.com/aimxnaim/", title: "Instagram" },
        { Icon: FaThreads, label: "THREAD", href: "https://www.threads.com/@aimxnaim", title: "Threads" },
    ]

    return (
        <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-6 lg:self-start"
        >
            <div className="rpg-panel p-5 flex flex-col gap-5">
                {/* Portrait */}
                <div className="relative mx-auto">
                    <div className="w-32 h-32 rounded-lg border border-gold-400/40 p-1 bg-rpg-panel overflow-hidden">
                        <img src={logo} alt="Aiman Naim" className="w-full h-full object-cover rounded-md" />
                    </div>
                    <span className="absolute -bottom-1.5 -right-1.5 pixel-font text-[7px] bg-gold-400 text-rpg-bg px-1.5 py-0.5 rounded leading-none">
                        LV.{liveAge()}
                    </span>
                </div>

                {/* Name + meta + class */}
                <div className="text-center flex flex-col gap-1.5">
                    <h1 className="rpg-font text-4xl text-gold-400 tracking-wider leading-none">AIMAN NAIM</h1>
                    <p className="text-xs text-neutral-400">
                        Kuala Lumpur <span className="text-gold-400/60">·</span> Age {liveAge()}
                    </p>
                    <p className="rpg-font text-xl text-neutral-300 mt-1">
                        <span className="text-neutral-500">[ </span>
                        <span className="text-gold-400">{klass}</span>
                        <Cursor cursorColor="#f0c040" />
                        <span className="text-neutral-500"> ]</span>
                    </p>
                </div>

                {/* HP / MP from Code::Stats */}
                <div className="rpg-panel-dim p-3 flex flex-col gap-2">
                    <p className="pixel-font text-[6px] text-gold-400/50 tracking-widest mb-1">LIVE from <a href="https://codestats.net/users/aimxnaim" target="_blank" rel="noreferrer" className="text-gold-400 hover:underline">Code::Stats </a>· HP=TOTAL · MP=TODAY</p>
                    <StatBar id="HP" colorClass="text-red-400" bar={loading ? null : hp} />
                    <StatBar id="MP" colorClass="text-blue-400" bar={loading ? null : mp} />
                </div>

                {/* Socials */}
                <div className="grid grid-cols-3 gap-2">
                    {socials.map(({ Icon, label, href, title }) => (
                        <motion.a
                            key={label}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            title={title}
                            className="rpg-panel-dim p-2 flex flex-col items-center gap-1 text-neutral-400 hover:text-gold-400 hover:border-gold-400/60 transition-colors"
                        >
                            <Icon className="text-lg" />
                            <span className="pixel-font text-[6px]">{label}</span>
                        </motion.a>
                    ))}

                    {/* Discord — copy username */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyDiscord}
                        title="Copy Discord username (mxxn512)"
                        className="rpg-panel-dim p-2 flex flex-col items-center gap-1 text-neutral-400 hover:text-gold-400 hover:border-gold-400/60 transition-colors"
                    >
                        <FaDiscord className="text-lg" />
                        <span className="pixel-font text-[6px]">{copied ? "COPIED" : "DISCORD"}</span>
                    </motion.button>

                    {/* Resume — download */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadResume}
                        title="Download Resume"
                        className="rpg-panel-sm p-2 flex flex-col items-center gap-1 text-gold-400 hover:bg-gold-400/10 transition-colors"
                    >
                        <FaFilePdf className="text-lg" />
                        <span className="pixel-font text-[6px]">RESUME</span>
                    </motion.button>
                </div>

                {/* Quote */}
                <div className="dialog-box">
                    <p className="pixel-font text-[7px] text-gold-400/60 tracking-widest mb-2">WORDS I LIVE BY</p>
                    <p className="text-sm text-neutral-200 italic leading-relaxed">
                        “So surely with hardships comes ease”
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-2">— Surah Ash-Sharh, Ayat 5</p>
                </div>

                {/* Compact credits / footer */}
                <div className="border-t border-gold-400/10 pt-4 flex flex-col items-center gap-1 text-center">
                    <p className="text-[11px] text-neutral-500">Built with React · Tailwind · Framer Motion</p>
                    <p className="pixel-font text-[6px] text-neutral-600 tracking-widest">© {new Date().getFullYear()} AIMAN NAIM</p>
                </div>
            </div>
        </motion.aside>
    )
}

export default Sidebar
