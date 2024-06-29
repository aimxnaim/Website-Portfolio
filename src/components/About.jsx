import aboutImg from '../assets/IMG_8211.jpg'
import { ABOUT_TEXT, EDUCATION } from '../constants/index'
import { motion } from "framer-motion"

const About = () => {
    return (
        <div
            id='about' className="border-b border-neutral-900 pb-4"
        >
            <h1 className="my-20 text-center text-4xl">
                About
                <span className="text-neutral-500"> Me</span>
            </h1>
            <div className="flex flex-wrap">
                <motion.div
                    whileInView={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full lg:w-1/2 lg:p-8"
                >
                    <div className="flex items-center justify-center">
                        <img className='rounded-2xl' src={aboutImg} alt="about" style={{ height: '360px' }} />
                    </div>
                </motion.div>
                <motion.div
                    whileInView={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="w-full lg:w-1/2"
                >
                    <div className="flex justify-center lg:justify-start">
                        <p className='my-2 max-w-xl py-6'>{ABOUT_TEXT}</p>
                    </div>
                    <p
                        className='my-2 max-w-xl py-6 font-semibold'>Here&apos;s my past education:</p>
                    {EDUCATION.map((education, index) => (
                        <div key={index} className="mb-8 flex flex-wrap lg:justify-center">
                            <motion.div
                                whileInView={{ opacity: 1, x: 0 }}
                                initial={{ opacity: 0, x: -100 }}
                                transition={{ duration: 1 }}
                                className="w-full lg:w-1/4"
                            >
                                <p className="mb-2 text-sm text-neutral-400">{education.year}</p>
                            </motion.div>
                            <motion.div
                                whileInView={{ opacity: 1, x: 0 }}
                                initial={{ opacity: 0, x: 100 }}
                                transition={{ duration: 1 }}
                                className="w-full max-w-xl  lg:w-3/4"
                            >
                                <h6 className="mb-2 font-semibold">
                                    {education.degree} -{" "}
                                    <span className="text-sm text-purple-50">
                                        {education.school}
                                    </span>
                                </h6>
                                <p className="mb-4 text-neutral-400">{education.description}</p>
                            </motion.div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default About