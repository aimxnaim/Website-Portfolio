import PropTypes from "prop-types"

const SIZE_CLASS = { sm: "pf-sm", md: "", lg: "pf-lg" }

const PixelWindow = ({
    title,
    size = "md",
    glow = false,
    className = "",
    innerClassName = "",
    children,
}) => (
    <div className={`pf-outer ${SIZE_CLASS[size]} ${glow ? "term-glow" : ""} ${className}`}>
        <div className={`pf-inner ${innerClassName}`}>
            {title && (
                <div className="win-bar">
                    <span className="dot dot-red" aria-hidden="true" />
                    <span className="dot dot-amber" aria-hidden="true" />
                    <span className="dot dot-green" aria-hidden="true" />
                    <span className="ml-1.5 font-mono text-[13px] text-term-muted">{title}</span>
                </div>
            )}
            {children}
        </div>
    </div>
)

PixelWindow.propTypes = {
    title: PropTypes.string,
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    glow: PropTypes.bool,
    className: PropTypes.string,
    innerClassName: PropTypes.string,
    children: PropTypes.node,
}

export default PixelWindow
