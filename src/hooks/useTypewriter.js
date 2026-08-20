import { useEffect, useState } from "react"

/**
 * Character-by-character typing driver.
 * Replaces the react-simple-typewriter dependency, which cannot express the
 * hero terminal's prompt-then-result rhythm.
 *
 * @param {Object} config
 * @param {string[]} config.words - Array of words to type. **MUST be a stable reference**
 *   (module-scope constant or `useMemo` result). An inline array literal
 *   (`words={["a", "b"]}`) creates a new reference every render, restarting the
 *   typing loop infinitely. If empty, returns `""`.
 * @param {number} [config.typeSpeed=55] - Milliseconds between each character typed
 * @param {number} [config.deleteSpeed=30] - Milliseconds between each character deleted
 * @param {number} [config.holdMs=1000] - Milliseconds to hold at end of word before deleting
 * @param {boolean} [config.loop=false] - If true, cycle through words forever; if false, type only the first word
 * @param {boolean} [config.enabled=true] - If false, immediately return the full first word
 * @returns {string} The currently-visible substring being typed
 */
export default function useTypewriter({
    words,
    typeSpeed = 55,
    deleteSpeed = 30,
    holdMs = 1000,
    loop = false,
    enabled = true,
}) {
    const [text, setText] = useState(enabled ? "" : (words[0] ?? ""))

    useEffect(() => {
        if (!Array.isArray(words) || words.length === 0) {
            setText("")
            return
        }

        if (!enabled) {
            setText(words[0])
            return
        }

        let cancelled = false
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

        const run = async () => {
            let i = 0
            do {
                const word = words[i % words.length]

                for (let c = 1; c <= word.length; c++) {
                    if (cancelled) return
                    setText(word.slice(0, c))
                    await sleep(typeSpeed)
                }

                if (!loop) return

                await sleep(holdMs)

                for (let c = word.length; c >= 0; c--) {
                    if (cancelled) return
                    setText(word.slice(0, c))
                    await sleep(deleteSpeed)
                }

                await sleep(200)
                i++
            } while (!cancelled)
        }

        run()
        return () => { cancelled = true }
    }, [words, typeSpeed, deleteSpeed, holdMs, loop, enabled])

    return text
}
