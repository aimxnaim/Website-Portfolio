import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { PROJECTS } from '../constants';
import { motion } from "framer-motion"

const Projects = () => {
    return (
        <div className=" pb-4">
            <motion.h1
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.5 }}
                className="my-20 text-center text-4xl"
            >
                Projects
            </motion.h1>

            <div>
                {PROJECTS.map((project, index) => (
                    <div key={index} className="my-20 mb-10 flex flex-wrap lg:justify-center">
                        <motion.div
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: -100 }}
                            transition={{ duration: 1 }}
                            className="w-full lg:w-1/4"
                        >
                            <img
                                src={project.image}
                                alt={project.name}
                                className="mb-6 rounded-lg shadow-lg"
                                width={250}
                                height={135}
                            />
                        </motion.div>
                        <motion.div
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: 100 }}
                            transition={{ duration: 1 }}
                            className="w-full max-w-xl lg:w-3/4"
                        >
                            <h6 className="mb-2 font-semibold">
                                {project.title}
                            </h6>
                            <p className="mb-4 text-neutral-400">{project.description}</p>
                            {project.technologies.map((technology, index) => (
                                <span key={index} className="mr-2 mt-4 text-sm bg-neutral-900 text-purple-700 px-2 py-1 rounded-lg font-medium">
                                    {technology}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                ))}
            </div>
            <div

                className="flex flex-wrap justify-center gap-8"
            >
                {PROJECTS.map((project, index) => (
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 9 }}
                        key={index}
                        className="lg:mt-14 lg:mb-14 relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                    > {/* Add mb-10 for margin bottom */}
                        <div className="p-5 pb-16"> {/* Add padding bottom to make space for the absolute positioned elements */}
                            <a href="#">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{project.title}</h5>
                            </a>
                            <p className="mb-14 font-normal text-gray-700 dark:text-gray-400">{project.description}</p>
                        </div>
                        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center"> {/* Use absolute positioning */}
                            <div className="flex flex-wrap">
                                {project.technologies.map((technology, index) => (
                                    <span key={index} className="mr-2 mt-2 text-sm bg-neutral-900 text-purple-700 px-2 py-1 rounded-lg font-medium">
                                        {technology}
                                    </span>
                                ))}
                            </div>
                            <div className="flex space-x-4">
                                <a href="#">
                                    <FaGithub className="text-gray-900 dark:text-white" size={22} />
                                </a>
                                <a href="#">
                                    <FaExternalLinkAlt className="text-gray-900 dark:text-white" size={22} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default Projects;
