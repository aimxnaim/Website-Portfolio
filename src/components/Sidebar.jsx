import { useState } from "react"
import { motion } from "framer-motion"
import { FaLinkedin, FaGithub, FaInstagram, FaThreads, FaDiscord, FaFilePdf } from "react-icons/fa6"
import PixelWindow from "./PixelWindow"
import useTypewriter from "../hooks/useTypewriter"
import useReducedMotion from "../hooks/useReducedMotion"
import { liveAge } from "../lib/clock"
import logo from "../assets/aiman.jpg"

const ROLE_WORDS = [
    "Full Stack Developer", "Front End Developer", "Back End Developer",
    "Coder", "Programmer", "Software Engineer", "Tech Enthusiast",
]

const downloadResume = () => {
    const link = document.createElement("a")
    link.href = "/Aiman_Naim_Resume.pdf"
    link.download = "Aiman_Naim_Resume.pdf"
    link.click()
}

const SOCIAL_CLASS =
    "bg-term-panel2 border-2 border-term-outline shadow-[2px_2px_0_#000] p-2 flex flex-col items-center gap-1 text-term-muted transition-colors hover:text-acc-green hover:border-acc-green hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_#000]"

const Sidebar = () => {
    const [copied, setCopied] = useState(false)
    const reduced = useReducedMotion()

    const role = useTypewriter({ words: ROLE_WORDS, loop: true, enabled: !reduced })

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
            initial={reduced ? false : { opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduced ? 0 : 0.5 }}
            className="w-full lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-6 lg:self-start"
        >
            <PixelWindow title="profile.dat" className="w-full" innerClassName="p-4 sm:p-5 flex flex-col gap-5">
                {/* Portrait */}
                <div className="relative mx-auto w-32 h-32">
                    <img
                        src={logo}
                        alt="Aiman Naim"
                        className="w-32 h-32 object-cover border-2 border-black"
                    />
                    <span className="absolute bottom-[-6px] right-[-6px] font-pixel text-[8px] bg-acc-green text-[#1e1f29] border-2 border-term-outline px-1.5 py-0.5 leading-none">
                        LV.{liveAge()}
                    </span>
                </div>

                {/* Name + meta + class */}
                <div className="text-center flex flex-col gap-1.5">
                    <h1 className="font-pixel text-[19px] text-term-text tracking-wider leading-relaxed">AIMAN NAIM</h1>
                    <p className="font-mono text-xs text-term-muted">
                        Kuala Lumpur <span className="text-acc-purple">·</span> Age {liveAge()}
                    </p>
                    <p className="font-mono text-sm text-acc-purple mt-1">
                        <span className="text-term-muted">[ </span>
                        <span>{role}</span>
                        <span className="term-cursor" aria-hidden="true" />
                        <span className="text-term-muted"> ]</span>
                    </p>
                </div>

                {/* Socials */}
                <div className="grid grid-cols-3 gap-2">
                    {socials.map(({ Icon, label, href, title }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            title={title}
                            className={SOCIAL_CLASS}
                        >
                            <Icon className="text-lg" />
                            <span className="font-pixel text-[8px]">{label}</span>
                        </a>
                    ))}

                    {/* Discord — copy username */}
                    <button
                        type="button"
                        onClick={copyDiscord}
                        title="Copy Discord username (mxxn512)"
                        className={SOCIAL_CLASS}
                    >
                        <FaDiscord className="text-lg" />
                        <span className="font-pixel text-[8px]">{copied ? "COPIED" : "DISCORD"}</span>
                    </button>

                    {/* Resume — download */}
                    <button
                        type="button"
                        onClick={downloadResume}
                        title="Download Resume"
                        className={`${SOCIAL_CLASS} bg-acc-green/10 text-acc-green`}
                    >
                        <FaFilePdf className="text-lg" />
                        <span className="font-pixel text-[8px]">RESUME</span>
                    </button>
                </div>

                {/* Quote */}
                <div className="border-l-[3px] border-acc-purple bg-term-panel2 px-3.5 py-3">
                    <p className="font-pixel text-[8px] text-acc-purple tracking-widest mb-2">WORDS I LIVE BY</p>
                    <p className="font-sans text-sm italic text-term-text leading-relaxed">
                        “So surely with hardships comes ease”
                    </p>
                    <p className="font-mono text-[11px] text-term-muted mt-2">— Surah Ash-Sharh, Ayat 5</p>
                </div>

                {/* Compact credits / footer */}
                <div className="border-t border-white/10 pt-3.5 flex flex-col items-center gap-1 text-center">
                    <p className="font-mono text-[10px] text-term-muted">Built with React, Tailwind & Vite — pixel/terminal edition</p>
                    <p className="font-pixel text-[8px] text-term-muted tracking-widest">© {new Date().getFullYear()} AIMAN NAIM</p>
                </div>
            </PixelWindow>
        </motion.aside>
    )
}

export default Sidebar
