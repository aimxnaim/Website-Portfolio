import logo from '../assets/kevinRushLogo.png'
import { FaLinkedin, FaGithub, FaInstagram, FaFilePdf } from 'react-icons/fa'

const Navbar = () => {
    return (
        <nav className="mb-20 mt-5 flex justify-between py-6">
            <div className="flex flex-shrink-0 items-center">
                <img className='mx-4 w-10' src={logo} alt="Logo" />
            </div>
            <div className="mx-3 flex items-center justify-center gap-4 text-2xl">
                <FaLinkedin className="cursor-pointer" />
                <FaGithub className="cursor-pointer" />
                <FaInstagram className="cursor-pointer" />
                <FaFilePdf className="cursor-pointer" />
            </div>
        </nav>
    )
}

export default Navbar
