import { EXPERIENCES } from "../constants"
import { motion } from "framer-motion"

const Experiences = () => {
    return (
        <div className="border-b border-neutral-900 pb-4">
            <motion.h1
                id="experience"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -100 }}
                transition={{ duration: 1.3, delay: 0.1 }}
                className="my-20 text-center text-4xl"
            >
                Experience
            </motion.h1>
            <div>
                {EXPERIENCES.map((experience, index) => (
                    <div key={index} className="mb-8 flex flex-wrap lg:justify-center">
                        <motion.div
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: -100 }}
                            transition={{ duration: 1 }}
                            className="lg:w-1/4 lg:mx-6 sm:mb-6 md: mb-6"
                        >
                            <motion.img
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                src={experience.image}
                                alt={experience.name}
                                className="rounded-lg shadow-lg sm:w-3/4 md:w-1/2 lg:w-full"
                            />
                        </motion.div>
                        <motion.div
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: 100 }}
                            transition={{ duration: 1 }}
                            className="w-full max-w-xl  lg:w-3/4 mx-6"
                        >
                                <h6 className="font-semibold">
                                    {experience.role} - {experience.company}
                                </h6>
                                <span className="inline-block mb-1 text-sm">{experience.year}</span>

                            <p className="my-4 text-neutral-400">
                                {experience.description.map((desc, index) => (
                                    <li key={index} className=" flex items-center space-x-3 rtl:space-x-reverse mb-2">
                                        <svg className="flex-shrink-0 text-purple-600 dark:text-purple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10 16 4-4-4-4" />
                                        </svg>
                                        <span>{desc}</span>
                                    </li>
                                ))}
                            </p>
                            <div className="flex flex-wrap">
                                {experience.technologies.map((technology, index) => (
                                    <span key={index} className="m-1 ml-0 text-sm bg-neutral-900 text-purple-600 py-1 px-2 rounded-lg font-medium">
                                        {technology}
                                    </span>

                                ))}
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Experiences