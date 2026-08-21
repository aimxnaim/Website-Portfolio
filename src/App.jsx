import { useCallback, useEffect, useRef, useState } from "react"
import { Analytics } from "@vercel/analytics/react"
import Backdrop from "./components/Backdrop"
import ScrollProgress from "./components/ScrollProgress"
import Taskbar from "./components/Taskbar"
import Ticker from "./components/Ticker"
import Rail from "./components/Rail"
import ContentPanel from "./components/ContentPanel"
import BootScreen from "./components/BootScreen"
import useReducedMotion from "./hooks/useReducedMotion"
import useTerminal from "./hooks/useTerminal"
import { TAB_IDS } from "./lib/tabs"

function App() {
    const [activeTab, setActiveTab] = useState(TAB_IDS[0])
    // Session-scoped: boot plays once per tab, not once per visit. A fresh
    // tab to the same URL re-plays it; a reload within the same tab does not.
    const [booted, setBooted] = useState(() => sessionStorage.getItem("boot-complete") === "1")
    // Shared with BootScreen so it can measure the About terminal's
    // on-screen rect for the FLIP morph target.
    const terminalWindowRef = useRef(null)
    const reduced = useReducedMotion()

    useEffect(() => {
        document.body.classList.add("term-theme")
        return () => document.body.classList.remove("term-theme")
    }, [])

    // Switching from a scrolled position in Projects to a short tab would
    // otherwise land the viewer below the content, so every switch returns
    // to the top. There is no longer anything to scroll *down* to — the
    // rail keeps navigation on screen at all times.
    const goToTab = useCallback((id) => {
        setActiveTab(id)
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
    }, [reduced])

    const terminal = useTerminal({ onNavigate: goToTab, started: booted })

    const handleBootFinish = useCallback(() => setBooted(true), [])

    return (
        <div className="overflow-x-clip antialiased selection:bg-acc-green/20 selection:text-acc-green">
            <ScrollProgress />
            <Backdrop />
            <Taskbar />
            {!booted && <BootScreen heroRef={terminalWindowRef} onFinish={handleBootFinish} />}

            {/* Clears the fixed taskbar. The ticker sits in normal flow
                directly beneath it and is allowed to scroll away. */}
            <div className="pt-[var(--taskbar-h)]">
                <Ticker />

                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                        <Rail active={activeTab} onTabChange={goToTab} />
                        <div className="w-full min-w-0 order-3 lg:order-none lg:flex-1">
                            <ContentPanel
                                active={activeTab}
                                terminal={{ ...terminal, windowRef: terminalWindowRef }}
                            />
                        </div>
                    </div>
                    <Analytics />
                </main>
            </div>
        </div>
    )
}

export default App
