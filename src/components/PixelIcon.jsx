import PropTypes from "prop-types"

// 8×8 bitmaps, '#' = filled. Drawn as unit rects with crispEdges so they stay
// hard-edged at any size — full-colour emoji were the one un-pixelated thing
// on the page and read as clip-art against the Dracula palette.
const ICONS = {
    about: [
        "..####..",
        "..####..",
        "..####..",
        "........",
        "..####..",
        ".######.",
        "########",
        "########",
    ],
    career: [
        "..####..",
        "..#..#..",
        "########",
        "########",
        "###..###",
        "########",
        "########",
        "........",
    ],
    education: [
        "........",
        "...##...",
        ".######.",
        "########",
        "..####..",
        "..#..#..",
        "..####..",
        "........",
    ],
    projects: [
        "###.....",
        "########",
        "#......#",
        "#......#",
        "#......#",
        "#......#",
        "########",
        "........",
    ],
    stack: [
        "..##.##.",
        "..#####.",
        "...###..",
        "...###..",
        "..###...",
        ".###....",
        "###.....",
        "##......",
    ],
}

const PixelIcon = ({ name, size = 14, className = "" }) => {
    const rows = ICONS[name]
    if (!rows) return null

    return (
        <svg
            viewBox="0 0 8 8"
            width={size}
            height={size}
            shapeRendering="crispEdges"
            aria-hidden="true"
            focusable="false"
            className={className}
        >
            {rows.map((row, y) =>
                [...row].map((cell, x) =>
                    cell === "#" ? (
                        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
                    ) : null,
                ),
            )}
        </svg>
    )
}

PixelIcon.propTypes = {
    name: PropTypes.oneOf(Object.keys(ICONS)).isRequired,
    size: PropTypes.number,
    className: PropTypes.string,
}

export default PixelIcon
