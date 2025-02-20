import About from './components/About'
import Experiences from './components/Experiences'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import Technology from './components/Technology'
import { Analytics } from "@vercel/analytics/react"

function App() {

  return (
    <>
      <div className='overflow-x-hidden text-neutral-300 antialiased  selection:bg-cyan-900'>
        <div className="fixed top-0 -z-10 h-full w-full">
          <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        </div>

        <div className="container mx-auto px-8">
          <Navbar />
          <Hero />
          <About />
          <Technology />
          <Experiences />
          <Projects />
          <Footer />
          <Analytics />

        </div>
      </div>
    </>
  )
}

export default App
