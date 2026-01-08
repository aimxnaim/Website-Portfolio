import { RiReactjsLine } from "react-icons/ri"
import { SiMongodb } from "react-icons/si"
import { FaNodeJs } from "react-icons/fa"
import { SiRedux } from "react-icons/si"
import { BiLogoPostgresql } from "react-icons/bi"
import { SiPostman } from "react-icons/si"
import { motion } from "framer-motion"
import { SiJavascript } from "react-icons/si";
import { FaBootstrap, FaGitAlt } from "react-icons/fa";

const iconVariants = (duration) => ({
    initial: { y: -10 },
    animate: {
        y: [10, -10],
        transition: {
            duration: duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
        },
        x: 0
    }

})
const Technology = () => {
    return (
        <div className="border-b border-neutral-800 pb-24">
            <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -100 }}
                transition={{ duration: 1.0, delay: 0.05 }}
                className="my-16 text-center flex flex-col items-center gap-3"
            >
                <h1 className="text-5xl font-semibold bg-gradient-to-r from-purple-200 via-purple-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(109,40,217,0.35)]">
                    Tech Stack
                </h1>
                <div className="h-1 w-24 rounded-full bg-purple-500/70 shadow shadow-purple-500/40" />
            </motion.div>
            <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -100 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-4"
            >
                <motion.div
                    variants={iconVariants(2.5)}
                    initial="initial"
                    animate="animate"
                    className="rounded-2xl border-4 border-neutral-800 p-4"
                >
                    <RiReactjsLine className="text-7xl text-cyan-400" />
                </motion.div>
                <motion.div
                    variants={iconVariants(3)}
                    initial="initial"
                    animate="animate"
                    className="rounded-2xl border-4 border-neutral-800 p-4"
                >
                    <SiMongodb className="text-7xl text-green-400" />
                </motion.div>
                <motion.div
                    variants={iconVariants(10)}
                    initial="initial"
                    animate="animate"
                    className="rounded-2xl border-4 border-neutral-800 p-4"
                >
                    <FaNodeJs className="text-7xl text-green-600" />
                </motion.div>
                <motion.div
                    variants={iconVariants(2)}
                    initial="initial"
                    animate="animate"
                    className="rounded-2xl border-4 border-neutral-800 p-4"
                >
                    <SiRedux className="text-7xl text-purple-700" />
                </motion.div>
                <motion.div
                    variants={iconVariants(4)}
                    initial="initial"
                    animate="animate"
                    className="rounded-2xl border-4 border-neutral-800 p-4"
                >
                    <BiLogoPostgresql className="text-7xl text-cyan-400" />
                </motion.div>
                <motion.div
                    variants={iconVariants(4)}
                    initial="initial"
                    animate="animate"
                    className="rounded-2xl border-4 border-neutral-800 p-4"
                >
                    <SiJavascript className="text-7xl text-yellow-400" />
                </motion.div>
                <motion.div
                    variants={iconVariants(4)}
                    initial="initial"
                    animate="animate"
                    className="rounded-2xl border-4 border-neutral-800 p-4"
                >
                    <FaBootstrap className="text-7xl text-purple-700" />
                </motion.div>
                <motion.div
                    variants={iconVariants(4)}
                    initial="initial"
                    animate="animate"
                    className="rounded-2xl border-4 border-neutral-800 p-4"
                >
                    <FaGitAlt className="text-7xl text-red-700" />
                </motion.div>
                <motion.div
                    variants={iconVariants(15)}
                    initial="initial"
                    animate="animate"
                    className="rounded-2xl border-4 border-neutral-800 p-4"
                >
                    <SiPostman className="text-7xl text-orange-500" />
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Technology