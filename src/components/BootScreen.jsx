import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import useReducedMotion from "../hooks/useReducedMotion"

const BOOT_LINES = [
    { text: "[ 0.0021 ] AIMAN.SYS kernel booting..." },
    { text: "[ 0.1840 ] mounting /about /career /education /projects /stack ... OK" },
    { text: "[ 0.4020 ] loading profile: aiman naim ................ OK" },
    { text: "[ 0.6710 ] fetching codestats.net/api ................. WARN", warn: true },
    { text: "[ 0.9330 ] compiling portfolio.tsx ..................... OK" },
    { text: "[ 1.2050 ] starting session-daemon ..................... OK" },
    { text: "[ 1.4400 ] launching AIMAN_NAIM v3.0 ..." },
]

export const BOOT_KEY = "boot-complete"
const LINE_INTERVAL_MS = 220
const AUTO_DISMISS_MS = 4200
const MORPH_MS = 500
// Guard rail for the FLIP: if the computed scale ratio between the boot box
// and the target window is outside this range (target not yet laid out, a
// stale/zero rect, or some other measurement fluke), skip the transform and
// let the plain opacity cross-fade (already on .boot-screen) carry the
// hand-off instead of risking a jumpy or inverted scale. Below `lg` the
// target can also be scrolled off screen (e.g. behind the nav/quote blocks
// stacked ahead of it) — in that case the scale ratio can still look
// perfectly stable, so `finish()` separately checks the rect's viewport
// position before trusting the transform.
const MIN_STABLE_SCALE = 0.05
const MAX_STABLE_SCALE = 4

/**
 * Fullscreen kernel-boot overlay shown once per browser session. It hands
 * off to the hero terminal via a FLIP transform: the boot box is measured
 * against the hero's PixelWindow (via `heroRef`) and translated/scaled onto
 * it with `transform` only, while the whole overlay fades out — revealing
 * the (already-mounted, already laid out) hero underneath. This keeps boot
 * and hero reading as one continuous object instead of a hard cut between
 * two terminals.
 */
const BootScreen = ({ onFinish, heroRef }) => {
    const reduced = useReducedMotion()
    const [shown, setShown] = useState(0)
    const [hiding, setHiding] = useState(false)

    const boxRef = useRef(null)
    // Ref-based (not state-based) idempotency guard: keydown, pointerdown,
    // the skip button, and the auto-timer can all race to call finish() in
    // the same tick, before a state update would have flushed.
    const firedRef = useRef(false)
    const morphTimerRef = useRef(null)

    // Reveal the kernel lines at a fixed cadence.
    useEffect(() => {
        if (reduced) {
            onFinish()
            return undefined
        }

        document.body.classList.add("boot-active")
        let cancelled = false

        const run = async () => {
            for (let i = 1; i <= BOOT_LINES.length; i++) {
                if (cancelled) return
                setShown(i)
                await new Promise((resolve) => setTimeout(resolve, LINE_INTERVAL_MS))
            }
        }
        run()

        // This is the single authoritative place `boot-active` is removed:
        // it fires on every exit path (skip, timeout, keypress, pointer, or
        // an unrelated unmount), so the page can never get stuck unscrollable.
        return () => {
            cancelled = true
            document.body.classList.remove("boot-active")
        }
    }, [reduced, onFinish])

    const finish = () => {
        if (firedRef.current) return
        firedRef.current = true

        sessionStorage.setItem(BOOT_KEY, "1")
        document.body.classList.remove("boot-active")

        const boxEl = boxRef.current
        const heroRect = heroRef?.current?.getBoundingClientRect?.()
        const bootRect = boxEl?.getBoundingClientRect?.()

        if (
            boxEl && heroRect && bootRect &&
            heroRect.width > 0 && heroRect.height > 0 &&
            bootRect.width > 0 && bootRect.height > 0
        ) {
            const scaleX = heroRect.width / bootRect.width
            const scaleY = heroRect.height / bootRect.height
            // On-screen check: the scale ratio alone can look perfectly
            // stable while the target sits below the fold (e.g. below `lg`,
            // where the identity and nav blocks stack ahead of the About
            // terminal). Without this, the boot box would translate far
            // down/up off-screen while fading out instead of morphing onto
            // something visible.
            const onScreen = heroRect.top < window.innerHeight && heroRect.bottom > 0
            const stable =
                onScreen &&
                scaleX > MIN_STABLE_SCALE && scaleX < MAX_STABLE_SCALE &&
                scaleY > MIN_STABLE_SCALE && scaleY < MAX_STABLE_SCALE

            if (stable) {
                const dx = (heroRect.left + heroRect.width / 2) - (bootRect.left + bootRect.width / 2)
                const dy = (heroRect.top + heroRect.height / 2) - (bootRect.top + bootRect.height / 2)
                boxEl.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`
            }
            // else: leave transform unset — the box stays put and simply
            // fades out with the rest of .boot-screen (the sanctioned
            // cross-fade fallback), rather than snapping to a wild scale.
        }
        // else: hero rect unavailable (e.g. heroRef not wired up) — same
        // fallback, the plain fade carries the whole hand-off.

        setHiding(true)
        morphTimerRef.current = setTimeout(onFinish, MORPH_MS)
    }

    // Keep a live pointer to the latest `finish` closure so the
    // listener-attaching effect below can run exactly once (mount to
    // unmount) instead of tearing down and re-adding window listeners and
    // the auto-dismiss timer on every boot-line tick.
    const finishRef = useRef(finish)
    finishRef.current = finish

    useEffect(() => {
        if (reduced) return undefined

        const dismiss = () => finishRef.current()
        window.addEventListener("keydown", dismiss)
        window.addEventListener("pointerdown", dismiss)
        const autoTimer = setTimeout(dismiss, AUTO_DISMISS_MS)

        return () => {
            window.removeEventListener("keydown", dismiss)
            window.removeEventListener("pointerdown", dismiss)
            clearTimeout(autoTimer)
        }
    }, [reduced])

    // Safety net for the post-finish() morph timer: if the component is
    // unmounted for any reason before it fires, clear it rather than
    // invoking onFinish on an unmounted component.
    useEffect(() => () => {
        if (morphTimerRef.current) clearTimeout(morphTimerRef.current)
    }, [])

    if (reduced) return null

    return (
        <div className={`boot-screen ${hiding ? "is-hiding" : ""}`} role="status" aria-live="polite">
            <div className="boot-box" ref={boxRef}>
                {BOOT_LINES.slice(0, shown).map((line) => (
                    <div key={line.text} className={`boot-line ${line.warn ? "is-warn" : ""}`}>
                        {line.text}
                    </div>
                ))}
                <button type="button" onClick={finish} className="btn btn-ghost mt-5 text-xs">
                    SKIP ▶
                </button>
            </div>
        </div>
    )
}

BootScreen.propTypes = {
    onFinish: PropTypes.func.isRequired,
    // Ref to AboutPanel's PixelWindow wrapper (see AboutPanel.jsx's
    // `windowRef`), used to measure the FLIP target rect. Optional: if
    // absent or not yet measurable, finish() falls back to the plain
    // cross-fade.
    heroRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any }),
    ]),
}

export default BootScreen
