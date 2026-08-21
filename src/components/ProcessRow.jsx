import PropTypes from "prop-types"
import PixelWindow from "./PixelWindow"

const BADGE_TONE = {
    running:  "bg-acc-green/20 text-acc-green",
    stable:   "bg-acc-cyan/20 text-acc-cyan",
    shipped:  "bg-acc-pink/20 text-acc-pink",
    progress: "bg-acc-orange/20 text-acc-orange",
}

const ProcessRow = ({ pid, name, badge, sub, bullets = [], tags = [], links = [], image, imageAlt, imageVariant = "chip", onClick }) => (
    <PixelWindow innerClassName="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-4 sm:gap-[18px] px-[22px] py-5">
        {/* The identity column: a logo where the entry has one, the PID as a
            fallback where it does not (project rows, whose image is a
            screenshot rendered further down rather than a mark). */}
        {image && imageVariant === "chip" ? (
            <span className="w-16 h-16 border-2 border-term-outline bg-term-panel2 p-2 flex items-center justify-center flex-shrink-0">
                <img src={image} alt={imageAlt || name} className="max-w-full max-h-full object-contain" />
            </span>
        ) : (
            <div className="font-mono text-xs text-term-muted flex sm:block gap-2 items-baseline">
                PID<span className="sm:block text-[17px] text-term-text">{pid}</span>
            </div>
        )}

        <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
                <span className="font-mono text-sm font-bold text-term-text">{name}</span>
                {badge && (
                    <span className={`font-mono text-xs px-2 py-0.5 border-2 border-term-outline ${BADGE_TONE[badge.tone]}`}>
                        {badge.label}
                    </span>
                )}
            </div>

            {sub && <div className="font-mono text-xs text-term-muted mb-2">{sub}</div>}

            {image && imageVariant === "screenshot" && (
                <div className="pf-outer pf-sm max-w-sm w-full my-2">
                    <div className="pf-inner">
                        <img
                            src={image}
                            alt={imageAlt || ""}
                            loading="lazy"
                            className="w-full h-auto block"
                        />
                    </div>
                </div>
            )}

            {bullets.length > 0 && (
                <ul className="font-sans text-sm text-term-muted list-disc ml-[18px] my-1.5 space-y-1">
                    {bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
            )}

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((t) => (
                        <span key={t} className="font-mono text-xs px-2 py-0.5 bg-term-panel2 border-2 border-term-outline text-term-muted">{t}</span>
                    ))}
                </div>
            )}

            {links.length > 0 && (
                <div className="flex gap-3 mt-3">
                    {links.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                           className="font-mono text-xs text-acc-green hover:underline">
                            ▶ {l.label}
                        </a>
                    ))}
                </div>
            )}

            {onClick && (
                <button type="button" onClick={onClick}
                        className="font-mono text-xs text-acc-purple hover:underline mt-3">
                    ▶ DETAILS
                </button>
            )}
        </div>
    </PixelWindow>
)

ProcessRow.propTypes = {
    pid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    badge: PropTypes.shape({ label: PropTypes.string, tone: PropTypes.oneOf(Object.keys(BADGE_TONE)) }),
    sub: PropTypes.string,
    bullets: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    links: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, href: PropTypes.string })),
    image: PropTypes.string,
    imageAlt: PropTypes.string,
    imageVariant: PropTypes.oneOf(["chip", "screenshot"]),
    onClick: PropTypes.func,
}

export default ProcessRow
