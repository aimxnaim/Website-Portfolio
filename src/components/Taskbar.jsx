import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { formatClock } from "../lib/clock"
import useReducedMotion from "../hooks/useReducedMotion"

const NAV = ["career", "education", "projects", "stack"]

const Taskbar = ({ onNavigate }) => {
    const [now, setNow] = useState(() => formatClock(new Date()))
    const reduced = useReducedMotion()

    useEffect(() => {
        const id = setInterval(() => setNow(formatClock(new Date())), 1000)
        return () => clearInterval(id)
    }, [])

    return (
        <header className="fixed top-0 left-0 right-0 z-[70]">
            <div className="taskbar">
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
                    className="font-mono text-sm font-bold text-term-text"
                >
                    aiman<span className="text-acc-green">@system</span>
                </button>

                <nav>
                    <ul className="hidden sm:flex gap-5 list-none">
                        {NAV.map((id) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => onNavigate(id)}
                                    className="font-mono text-[13px] text-term-muted hover:text-acc-green transition-colors"
                                >
                                    {id}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-3.5 font-mono text-xs text-term-muted">
                    <span className="status-dot" aria-hidden="true" />
                    <span>ONLINE</span>
                    <span>{now}</span>
                </div>
            </div>
        </header>
    )
}

Taskbar.propTypes = { onNavigate: PropTypes.func.isRequired }

export default Taskbar
