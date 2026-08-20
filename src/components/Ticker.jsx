const ITEMS = [
    { tone: "ok", label: "[OK]", text: "full stack developer @ ernst & young" },
    { tone: "ok", label: "[OK]", text: "angular + node/express + gcp" },
    { tone: "warn", label: "[INFO]", text: "building compliance platforms for malaysia's ccc" },
    { tone: "ok", label: "[OK]", text: "uitm computer science grad, cgpa 3.53" },
    { tone: "warn", label: "[INFO]", text: "codestats streak: active" },
]

const Run = () => (
    <span>
        {ITEMS.map((it) => (
            <span key={it.text}>
                <span className={it.tone === "ok" ? "text-acc-green" : "text-acc-orange"}>{it.label}</span>
                {` ${it.text}  •  `}
            </span>
        ))}
    </span>
)

const Ticker = () => (
    <div className="ticker" aria-hidden="true">
        <span className="ticker-label">tail -f system.log</span>
        <div className="ticker-track">
            <Run />
            <Run />
        </div>
    </div>
)

export default Ticker
