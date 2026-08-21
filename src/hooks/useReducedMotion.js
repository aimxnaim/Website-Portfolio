import useMediaQuery from "./useMediaQuery"

const QUERY = "(prefers-reduced-motion: reduce)"

export default function useReducedMotion() {
    return useMediaQuery(QUERY)
}
