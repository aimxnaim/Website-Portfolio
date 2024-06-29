import logo from '../assets/kevinRushLogo.png'
import { FaLinkedin, FaGithub, FaInstagram, FaFilePdf } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Navbar = () => {
    return (
        <nav className="mb-20 mt-5 flex justify-between py-6">
            <div className="flex flex-shrink-0 items-center">
                <img className='mx-4 w-10' src={logo} alt="Logo" />
            </div>
            <div className="mx-3 flex items-center justify-center gap-4 text-2xl">
                <motion.a
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    href="https://www.linkedin.com/in/aimannaimfaizul/"
                >
                    <FaLinkedin className="cursor-pointer" />
                </motion.a>
                <motion.a
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    href="https://github.com/aimxnaim"
                >
                    <FaGithub className="cursor-pointer" />
                </motion.a>
                <motion.a
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    href="https://www.instagram.com/aimxnaim/"
                >
                    <FaInstagram className="cursor-pointer" />
                </motion.a>
                <FaFilePdf className="cursor-pointer" />
            </div>
        </nav>
    )
}

export default Navbar
