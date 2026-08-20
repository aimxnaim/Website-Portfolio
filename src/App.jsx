import { useCallback, useEffect, useRef, useState } from "react"
import { Analytics } from "@vercel/analytics/react"
import Backdrop from "./components/Backdrop"
import useReducedMotion from "./hooks/useReducedMotion"
import ScrollProgress from "./components/ScrollProgress"
import Sidebar from "./components/Sidebar"
import ContentPanel from "./components/ContentPanel"
import Taskbar from "./components/Taskbar"
import Hero from "./components/Hero"
import BootScreen from "./components/BootScreen"
import Ticker from "./components/Ticker"
import Intro from "./components/Intro"

function App() {
    const [activeTab, setActiveTab] = useState("career")
    // Session-scoped: boot plays once per tab, not once per visit. A fresh
    // tab to the same URL re-plays it; a reload within the same tab does not.
    const [booted, setBooted] = useState(() => sessionStorage.getItem("boot-complete") === "1")
    // Shared with BootScreen so it can measure the hero terminal's on-screen
    // rect for the FLIP morph target.
    const heroWindowRef = useRef(null)
    const reduced = useReducedMotion()

    useEffect(() => {
        document.body.classList.add("term-theme")
        return () => document.body.classList.remove("term-theme")
    }, [])

    const goToTab = (id) => {
        setActiveTab(id)
        document.getElementById("main")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
    }

    const handleBootFinish = useCallback(() => setBooted(true), [])

    return (
        <div className="overflow-x-hidden antialiased selection:bg-acc-green/20 selection:text-acc-green">
            <ScrollProgress />
            <Backdrop />
            <Taskbar onNavigate={goToTab} />
            {!booted && <BootScreen heroRef={heroWindowRef} onFinish={handleBootFinish} />}
            <Hero onNavigate={goToTab} started={booted} windowRef={heroWindowRef} />
            <Ticker />
            <Intro />

            <div id="main" className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <Sidebar />
                    <ContentPanel active={activeTab} onTabChange={setActiveTab} />
                </div>
                <Analytics />
            </div>
        </div>
    )
}

export default App
