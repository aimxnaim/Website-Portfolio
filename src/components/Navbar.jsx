import logo from '../assets/kevinRushLogo.png'
import { FaLinkedin } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'
import { FaInstagram } from 'react-icons/fa'

function App() {

    return (
        <nav className="bg-red-900 mb-20 flex text-center justify-between py-6">
            <div className="flex flex-shrink-0 items-center">
                <img src={logo} alt="" />
            </div>
            <div className="m-8 flex items-center justify-center gap-4 text-2xl">
                <FaLinkedin />
                <FaGithub />
                <FaInstagram />
            </div>
        </nav>
    )
}

export default App
