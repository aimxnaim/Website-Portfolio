import { useEffect, useState } from "react"
import { FaLinkedin, FaGithub, FaInstagram, FaThreads, FaDiscord, FaFilePdf } from "react-icons/fa6"
import { formatClock } from "../lib/clock"
import { downloadResume } from "../lib/resume"
import useReducedMotion from "../hooks/useReducedMotion"

const SOCIALS = [
    { Icon: FaLinkedin,  href: "https://www.linkedin.com/in/aimannaimfaizul/", title: "LinkedIn" },
    { Icon: FaGithub,    href: "https://github.com/aimxnaim",                  title: "GitHub" },
    { Icon: FaInstagram, href: "https://www.instagram.com/aimxnaim/",          title: "Instagram" },
    { Icon: FaThreads,   href: "https://www.threads.com/@aimxnaim",            title: "Threads" },
]

const ICON_CLASS =
    "p-1.5 text-term-muted hover:text-acc-green transition-colors"

const Taskbar = () => {
    const [now, setNow] = useState(() => formatClock(new Date()))
    const [copied, setCopied] = useState(false)
    const reduced = useReducedMotion()

    useEffect(() => {
        const id = setInterval(() => setNow(formatClock(new Date())), 1000)
        return () => clearInterval(id)
    }, [])

    const copyDiscord = async () => {
        try {
            await navigator.clipboard.writeText("mxxn512")
        } catch {
            // Clipboard can reject on insecure origins or a denied permission.
            // The confirmation still fires: the username is in the tooltip, so
            // the user has a manual fallback either way.
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-[70]">
            <div className="taskbar">
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
                    className="font-mono text-sm font-bold text-term-text flex-shrink-0"
                >
                    aiman<span className="text-acc-green">@system</span>
                </button>

                <div className="flex items-center gap-0.5 sm:gap-1">
                    {SOCIALS.map(({ Icon, href, title }) => (
                        <a
                            key={title}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            title={title}
                            aria-label={title}
                            className={ICON_CLASS}
                        >
                            <Icon className="text-lg" />
                        </a>
                    ))}

                    <button
                        type="button"
                        onClick={copyDiscord}
                        title="Copy Discord username (mxxn512)"
                        aria-label="Copy Discord username"
                        className={`${ICON_CLASS} ${copied ? "text-acc-green" : ""}`}
                    >
                        <FaDiscord className="text-lg" />
                    </button>

                    <span className="sr-only" role="status">
                        {copied ? "Discord username copied" : ""}
                    </span>

                    <button
                        type="button"
                        onClick={downloadResume}
                        title="Download Resume"
                        className="ml-1.5 sm:ml-2.5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1.5 bg-acc-green text-[#1e1f29] border-2 border-term-outline shadow-[2px_2px_0_#000] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_#000] transition-transform"
                    >
                        <FaFilePdf aria-hidden="true" />
                        RESUME
                    </button>
                </div>

                {/* Logo + 5 icons + RESUME already fill a 375px bar, so the
                    clock and status dot drop out below sm. Both are
                    decorative and the phone shows its own clock. */}
                <div className="hidden sm:flex items-center gap-3.5 font-mono text-xs text-term-muted flex-shrink-0">
                    <span className="status-dot" aria-hidden="true" />
                    <span>ONLINE</span>
                    <span>{now}</span>
                </div>
            </div>
        </header>
    )
}

export default Taskbar
