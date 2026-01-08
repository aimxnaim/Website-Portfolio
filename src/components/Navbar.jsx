import logo from '../assets/aiman.jpg'
import { FaLinkedin, FaGithub, FaInstagram, FaFilePdf } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Navbar = () => {
    const downloadResume = () => {
        const link = document.createElement('a');
        link.href = '/Aiman_Naim_Resume.pdf'; // Path to your resume in the public directory
        link.download = 'Aiman_Naim_Resume.pdf';
        link.click();
    };
    return (
        <nav className="mb-20 mt-5 flex justify-between py-6">
            <div className="flex flex-shrink-0 items-center">
                <img className='mx-4 w-12 h-12 rounded-full border border-purple-500/50 shadow-md shadow-purple-800/40 object-cover' src={logo} alt="Aiman Naim" />
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
                <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={downloadResume}
                >
                    <FaFilePdf className="cursor-pointer" />
                </motion.button>
            </div>
        </nav>
    )
}

export default Navbar
