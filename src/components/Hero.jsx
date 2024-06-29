import { HERO_CONTENT } from '../constants/index'
import profilePic from '../assets/ProfilePic.jpeg'
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

const Hero = () => {
    const [text] = useTypewriter({
        words: ['Full Stack Developer', 'Front End Developer', 'Back End Developer', 'Programmer', 'Coder'],
        loop: 0,
        deleteSpeed: 50,
        typeSpeed: 50,
    })
    return (
        <div className="border-b border-neutral-900 pb-4 lg:mb-35">
            <div className="flex flex-wrap items-center">
                <div className="w-full lg:w-2/3">
                    <div className="flex flex-col items-center lg:items-start lg:pl-6">
                        <motion.h1
                            variants={container(0.1)}
                            initial="hidden"
                            animate="visible"
                            className="pb-8 text-6xl font-thin tracking-tight lg:mt-16 lg:text-7xl"
                        >
                            Aiman Naim
                        </motion.h1>
                        <motion.span
                            variants={container(0.5)}
                            initial="hidden"
                            animate="visible"
                            className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-4xl tracking-tight text-transparent lg:text-5xl"
                        >
                            <div className='pl-6 md:pl-0'>
                                <span className="text-white bg-clip-text text-4xl tracking-tight text-transparent lg:text-5xl">I&apos;m a </span>{text}
                                <Cursor cursorColor='purple' />
                            </div>
                        </motion.span>
                        <motion.p
                            variants={container(0.9)}
                            initial="hidden"
                            animate="visible"
                            className='my-2 max-w-2xl p-6 md:pl-0 md:text-center font-light tracking-tighter lg:text-left'
                        >
                            {HERO_CONTENT}
                        </motion.p>
                    </div>
                </div>
                <div className="w-full lg:w-1/3 lg:pl-4 flex justify-center lg:justify-between">
                    <motion.img
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className=" w-80 h-80 object-cover lg:w-96 lg:h-96 rounded-lg" src={profilePic}
                        alt="Aiman Naim"
                    />
                </div>
            </div>
        </div>
    )
}

export default Hero
