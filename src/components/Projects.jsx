import { FaGithub } from 'react-icons/fa';
import { PROJECTS, SMALL_PROJECTS } from '../constants';
import { motion } from "framer-motion";
import { FaGlobe } from 'react-icons/fa';


const Projects = () => {
    return (
        <div className="pb-4">
            <motion.h1
                id='projects'
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
                            className="w-full lg:w-2/4"
                        >
                            <motion.img
                                whileHover={{ scale: 1.035 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                src={project.image}
                                alt={project.title}
                                className="mb-6 rounded-lg shadow-lg"
                                width={600}
                                height={250}
                            />
                        </motion.div>
                        <motion.div
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: 100 }}
                            transition={{ duration: 1 }}
                            className="w-full max-w-xl lg:w-2/4"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h6 className="font-semibold">
                                    {project.title}
                                </h6>
                                <div className="flex space-x-4 ml-2">
                                    <motion.a
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        href={project.githubLink} // Add the GitHub link here
                                    >
                                        <FaGithub className="text-white" size={20} />
                                    </motion.a>
                                    {project.liveLink && (
                                        <motion.a
                                            href={project.liveLink} // Add the live site link here
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FaGlobe className="text-white" size={20} />
                                        </motion.a>

                                    )}
                                </div>
                            </div>
                            <ul className="space-y-4 text-left text-gray-400 dark:text-gray-400">
                                {project.description.map((desc, index) => (
                                    <li key={index} className=" flex items-center space-x-3 rtl:space-x-reverse mb-2">
                                        <svg className="flex-shrink-0 text-purple-600 dark:text-purple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10 16 4-4-4-4" />
                                        </svg>
                                        <span>{desc}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className='flex flex-wrap mt-2'>
                                {project.technologies.map((technology, index) => (
                                    <span key={index} className="mr-2 mt-4 text-sm bg-neutral-900 text-purple-500 px-2 py-1 rounded-lg font-medium">
                                        {technology}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap justify-center gap-8">
                {SMALL_PROJECTS.map((project, index) => (
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 9 }}
                        key={index}
                        className="flex flex-col justify-between h-full lg:mt-14 lg:mb-14 relative max-w-sm border rounded-lg shadow bg-gray-800 border-gray-700"
                    >
                        <div className="p-5">

                            <div className="flex justify-between items-center mb-4">
                                <h6 className="mb-2 text-2xl font-bold tracking-tight text-white ">
                                    {project.title}
                                </h6>
                                <div className="flex space-x-4 ml-2">
                                    <motion.a
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        href={project.githubLink} // Add the GitHub link here
                                    >
                                        <FaGithub className="text-white" size={20} />
                                    </motion.a>
                                    {project.liveLink && (
                                        <motion.a
                                            href={project.liveLink} // Add the live site link here
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FaGlobe className="text-white" size={20} />
                                        </motion.a>

                                    )}
                                </div>
                            </div>
                            <div className="list-disc list-inside text-gray-400">
                                {project.description}
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-start items-center m-4 mb-2">
                            {project.technologies.map((technology, index) => (
                                <span key={index} className="m-2 mt-1 text-sm bg-neutral-900 text-purple-500 px-2 py-1 rounded-lg font-medium">
                                    {technology}
                                </span>
                            ))}
                        </div>
                    </motion.div>


                ))}
            </div>
        </div>
    );
};

export default Projects;
