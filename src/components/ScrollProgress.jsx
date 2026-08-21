import { useEffect, useState } from "react"

const ScrollProgress = () => {
    const [pct, setPct] = useState(0)

    useEffect(() => {
        const update = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            setPct(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0)
        }
        update()
        window.addEventListener("scroll", update, { passive: true })
        window.addEventListener("resize", update)
        return () => {
            window.removeEventListener("scroll", update)
            window.removeEventListener("resize", update)
        }
    }, [])

    return (
        <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
    )
}

export default ScrollProgress
