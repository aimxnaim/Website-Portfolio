import logo from '../assets/aiman.jpg'
import { FaLinkedin, FaGithub, FaInstagram, FaFilePdf } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Navbar = () => {
    const downloadResume = () => {
        const link = document.createElement('a');
        link.href = '/Aiman_Naim_Resume.pdf';
        link.download = 'Aiman_Naim_Resume.pdf';
        link.click();
    };

    return (
        <nav className="mb-16 mt-5 py-4 border-b-2 border-gold-400/20 flex items-center justify-between gap-4 flex-wrap">
            {/* Left: Character HUD */}
            <div className="flex items-center gap-3">
                {/* Portrait frame */}
                <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 border-2 border-gold-400 p-0.5 bg-rpg-panel">
                        <img
                            src={logo}
                            alt="Aiman Naim"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="absolute -bottom-1.5 -right-1.5 pixel-font text-[7px] bg-gold-400 text-rpg-bg px-1 py-0.5 leading-none">
                        LV.24
                    </span>
                </div>

                {/* Name + bars */}
                <div className="flex flex-col gap-1.5">
                    <span className="pixel-font text-gold-400 text-[9px] tracking-widest">AIMAN NAIM</span>
                    <span className="text-neutral-400 text-xs font-medium">Full Stack Developer</span>

                    {/* HP bar */}
                    <div className="flex items-center gap-2">
                        <span className="pixel-font text-red-400 text-[7px] w-4">HP</span>
                        <div className="stat-bar-track w-24 flex-shrink-0">
                            <div className="stat-bar-fill bar-hp" style={{ width: '90%' }} />
                        </div>
                        <span className="text-neutral-500 text-[10px]">90/100</span>
                    </div>

                    {/* MP bar */}
                    <div className="flex items-center gap-2">
                        <span className="pixel-font text-blue-400 text-[7px] w-4">MP</span>
                        <div className="stat-bar-track w-24 flex-shrink-0">
                            <div className="stat-bar-fill bar-mp" style={{ width: '75%' }} />
                        </div>
                        <span className="text-neutral-500 text-[10px]">75/100</span>
                    </div>
                </div>
            </div>

            {/* Right: Social links styled as RPG action buttons */}
            <div className="flex items-center gap-2">
                <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href="https://www.linkedin.com/in/aimannaimfaizul/"
                    target="_blank"
                    rel="noreferrer"
                    className="rpg-panel-dim p-2 flex items-center gap-1.5 text-neutral-400 hover:text-gold-400 hover:border-gold-400/60 transition-colors"
                    title="LinkedIn"
                >
                    <FaLinkedin className="text-lg" />
                    <span className="pixel-font text-[7px] hidden sm:block">LINK</span>
                </motion.a>

                <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href="https://github.com/aimxnaim"
                    target="_blank"
                    rel="noreferrer"
                    className="rpg-panel-dim p-2 flex items-center gap-1.5 text-neutral-400 hover:text-gold-400 hover:border-gold-400/60 transition-colors"
                    title="GitHub"
                >
                    <FaGithub className="text-lg" />
                    <span className="pixel-font text-[7px] hidden sm:block">CODE</span>
                </motion.a>

                <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href="https://www.instagram.com/aimxnaim/"
                    target="_blank"
                    rel="noreferrer"
                    className="rpg-panel-dim p-2 flex items-center gap-1.5 text-neutral-400 hover:text-gold-400 hover:border-gold-400/60 transition-colors"
                    title="Instagram"
                >
                    <FaInstagram className="text-lg" />
                    <span className="pixel-font text-[7px] hidden sm:block">INSTA</span>
                </motion.a>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={downloadResume}
                    className="rpg-panel-sm p-2 flex items-center gap-1.5 text-gold-400 transition-colors hover:bg-gold-400/10"
                    title="Download Resume"
                >
                    <FaFilePdf className="text-lg" />
                    <span className="pixel-font text-[7px] hidden sm:block">RESUME</span>
                </motion.button>
            </div>
        </nav>
    )
}

export default Navbar
