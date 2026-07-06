import Sidebar from './components/Sidebar'
import ContentPanel from './components/ContentPanel'
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <>
      <div className='overflow-x-hidden text-neutral-300 antialiased selection:bg-gold-400/20 selection:text-gold-400'>
        {/* RPG background */}
        <div className="fixed top-0 -z-10 h-full w-full">
          <div className="absolute inset-0 -z-10 h-full w-full bg-rpg" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <Sidebar />
            <ContentPanel />
          </div>
          <Analytics />
        </div>
      </div>
    </>
  )
}

export default App
