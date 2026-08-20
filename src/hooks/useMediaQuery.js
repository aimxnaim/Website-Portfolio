import { useEffect, useState } from "react"

// Shared OS-level media-query hook, read live via matchMedia. Both
// useReducedMotion and Hero's desktop-vs-chip check are the same shape:
// read the current match synchronously for the initial render, then
// subscribe for live changes so the UI reacts as the query flips (e.g.
// rotating a device, or toggling reduced motion in OS settings) instead of
// only on next mount.
export default function useMediaQuery(query) {
    const [matches, setMatches] = useState(
        () => typeof window !== "undefined" && window.matchMedia(query).matches
    )

    useEffect(() => {
        const mq = window.matchMedia(query)
        const onChange = (e) => setMatches(e.matches)
        setMatches(mq.matches)
        mq.addEventListener("change", onChange)
        return () => mq.removeEventListener("change", onChange)
    }, [query])

    return matches
}
