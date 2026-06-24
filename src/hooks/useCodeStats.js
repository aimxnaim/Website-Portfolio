import { useState, useEffect } from "react"

const ENDPOINT = "https://codestats.net/api/users/aimxnaim"

// Noise entries from the Code::Stats API we don't want to surface as "languages"
const IGNORED_LANGS = new Set([
    "scminput", "Plain text", "Log", "chatagent", "Ignore", "Properties", "DotEnv",
])

const toSortedList = (obj, filterFn = () => true) =>
    Object.entries(obj)
        .filter(([name]) => filterFn(name))
        .map(([name, info]) => ({ name, xp: info.xps }))
        .sort((a, b) => b.xp - a.xp)

/**
 * Fetches Code::Stats data once and derives:
 *  - langs:    top languages by XP (noise filtered)
 *  - machines: machines by XP
 *  - totalXp:  all-time total XP
 *  - hp / mp:  daily XP for the latest / previous active day, plus a % of the
 *              user's best-ever day so they render nicely as RPG bars.
 */
export default function useCodeStats() {
    const [state, setState] = useState({
        langs: [],
        machines: [],
        totalXp: 0,
        hp: null,
        mp: null,
        loading: true,
        error: false,
    })

    useEffect(() => {
        let cancelled = false

        fetch(ENDPOINT)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                return r.json()
            })
            .then((json) => {
                if (cancelled) return

                const langs = toSortedList(json.languages, (n) => !IGNORED_LANGS.has(n)).slice(0, 10)
                const machines = toSortedList(json.machines).slice(0, 6)

                // Daily XP: most recent active day = HP, the one before = MP.
                const dates = json.dates || {}
                const dayValues = Object.values(dates)
                const peak = dayValues.length ? Math.max(...dayValues) : 1
                const sortedDays = Object.entries(dates).sort((a, b) => (a[0] < b[0] ? 1 : -1))

                const toBar = (entry) =>
                    entry ? { date: entry[0], xp: entry[1], pct: Math.round((entry[1] / peak) * 100) } : null

                setState({
                    langs,
                    machines,
                    totalXp: json.total_xp || 0,
                    hp: toBar(sortedDays[0]),
                    mp: toBar(sortedDays[1]),
                    loading: false,
                    error: false,
                })
            })
            .catch(() => {
                if (!cancelled) setState((s) => ({ ...s, loading: false, error: true }))
            })

        return () => {
            cancelled = true
        }
    }, [])

    return state
}
