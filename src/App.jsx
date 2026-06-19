import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import About from './components/About'
import Tabs from './components/Tabs'
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <>
      <div className='overflow-x-hidden text-neutral-300 antialiased selection:bg-gold-400/20 selection:text-gold-400'>
        {/* RPG background */}
        <div className="fixed top-0 -z-10 h-full w-full">
          <div className="absolute inset-0 -z-10 h-full w-full bg-rpg" />
        </div>

        <div className="container mx-auto px-6 lg:px-8">
          <Navbar />
          <Hero />
          <About />
          <Tabs />
          <Footer />
          <Analytics />
        </div>
      </div>
    </>
  )
}

export default App
