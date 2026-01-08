// import { HERO_CONTENT } from '../constants/index'
import { motion } from "framer-motion"
import { Cursor, useTypewriter } from 'react-simple-typewriter'

const container = (delay) => ({
    hidden: { opacity: 0, x: -100 },
    visible: {
        opacity: 1,
        transition: {
            delay: delay,
            duration: 0.6,
        },
        x: 0,
    }
})

const floatingAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
}

const Hero = () => {
    const [text] = useTypewriter({
        words: ['Full Stack Developer', 'Front End Developer', 'Back End Developer', 'Programmer', 'Coder'],
        loop: 0,
        deleteSpeed: 50,
        typeSpeed: 50,
    })
    return (
        <div className="border-b border-neutral-900 pb-4 lg:mb-35">
            <div className="flex flex-wrap items-center justify-center">
                <div className="w-full lg:w-3/4 flex justify-center">
                    <div className="flex flex-col items-center gap-6">
                        <motion.h1
                            id='hero'
                            variants={container(0.1)}
                            initial="hidden"
                            animate="visible"
                            className="pb-4 text-6xl font-thin tracking-tight lg:mt-16 lg:text-8xl text-center"
                        >
                            Aiman Naim
                        </motion.h1>
                        
                        <motion.div
                            variants={container(0.5)}
                            initial="hidden"
                            animate="visible"
                            className="h-20 flex items-center justify-center"
                        >
                            <span className="text-white text-4xl lg:text-6xl font-light mr-2">I&apos;m a </span>
                            <span className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-4xl lg:text-6xl font-light tracking-tight text-transparent">
                                {text}
                                <Cursor cursorColor='purple' />
                            </span>
                        </motion.div>

                        <motion.div
                            variants={floatingAnimation}
                            initial="hidden"
                            animate="visible"
                            className="flex gap-6 mt-8 mb-3"
                        >
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 0 }}
                                className="text-center"
                            >
                                <div className="text-3xl font-bold text-purple-400">2+</div>
                                <div className="text-sm text-neutral-400">Years Experience</div>
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}
                                className="text-center border-l border-r border-neutral-700 px-6"
                            >
                                <div className="text-3xl font-bold text-purple-400">5+</div>
                                <div className="text-sm text-neutral-400">Projects</div>
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 0.4 }}
                                className="text-center"
                            >
                                <div className="text-3xl font-bold text-purple-400">Tech Stack</div>
                                <div className="text-sm text-neutral-400">Diverse & Modern</div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            variants={floatingAnimation}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 1 }}
                            className="mt-12"
                        >
                            {/* <a
                                href="#projects"
                                className="inline-block px-8 py-3 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-600/10 transition-colors"
                            >
                                Explore My Work
                            </a> */}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
