import useReducedMotion from "../hooks/useReducedMotion"

const PARTICLES = [
    { left: "4%",  color: "#50fa7b", duration: "10s", delay: "0s" },
    { left: "14%", color: "#ff79c6", duration: "13s", delay: "2s" },
    { left: "24%", color: "#8be9fd", duration: "9s",  delay: "4s" },
    { left: "38%", color: "#bd93f9", duration: "12s", delay: "1s" },
    { left: "52%", color: "#ffb86c", duration: "11s", delay: "5s" },
    { left: "66%", color: "#ff79c6", duration: "14s", delay: "3s" },
    { left: "78%", color: "#50fa7b", duration: "10s", delay: "6s" },
    { left: "88%", color: "#8be9fd", duration: "13s", delay: "2.5s" },
    { left: "95%", color: "#bd93f9", duration: "9s",  delay: "4.5s" },
]

const Backdrop = () => {
    const reduced = useReducedMotion()
    if (reduced) return null

    return (
        <div className="particles" aria-hidden="true">
            {PARTICLES.map((p) => (
                <span
                    key={p.left}
                    className="particle"
                    style={{
                        left: p.left,
                        background: p.color,
                        boxShadow: `0 0 6px ${p.color}`,
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                    }}
                />
            ))}
        </div>
    )
}

export default Backdrop
