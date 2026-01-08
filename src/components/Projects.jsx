import { useState } from 'react';
import { FaGithub, FaGlobe } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, SMALL_PROJECTS } from '../constants';
import ProjectModal from './ProjectModal';

const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

const Projects = () => {
    const [selected, setSelected] = useState(null);

    const renderCard = (project, index) => {
        const isFeatured = project.featured;
        const summary = Array.isArray(project.description)
            ? project.description[0]
            : project.description;
        const techPreview = (project.technologies || []).slice(0, 6);

        return (
            <motion.div
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
                key={`${project.title}-${index}`}
                onClick={() => setSelected(project)}
                whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.12, ease: "easeOut" } }}
                className={`cursor-pointer rounded-2xl border p-5 shadow-md transition ${
                    isFeatured
                        ? "md:col-span-2 bg-gradient-to-br from-purple-900/40 to-purple-700/20 border-purple-600 ring-2 ring-purple-600/30 hover:shadow-purple-700/30"
                        : "bg-neutral-900/60 border-neutral-800 hover:shadow-lg"
                }`}
            >
                <div className="mb-3 flex items-start justify-between">
                    <h3 className={`font-semibold ${isFeatured ? "text-2xl" : "text-xl"}`}>{project.title}</h3>
                    <div className="ml-2 flex items-center gap-3">
                        {project.githubLink && (
                            <motion.a whileHover={{ scale: 1.15 }} href={project.githubLink} onClick={(e)=>e.stopPropagation()}>
                                <FaGithub />
                            </motion.a>
                        )}
                        {project.liveLink && (
                            <motion.a whileHover={{ scale: 1.15 }} href={project.liveLink} onClick={(e)=>e.stopPropagation()}>
                                <FaGlobe />
                            </motion.a>
                        )}
                    </div>
                </div>
                <p className="text-sm text-gray-300">{summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {techPreview.map((t, i) => (
                        <span key={i} className="text-xs bg-neutral-800 text-purple-400 px-2 py-1 rounded-lg border border-neutral-700">
                            {t}
                        </span>
                    ))}
                </div>
            </motion.div>
        );
    };

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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {PROJECTS.map((p, i) => renderCard(p, i))}
            </div>

            <h2 className="mt-12 mb-6 text-center text-2xl">Small Projects</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {SMALL_PROJECTS.map((p, i) => renderCard(p, i))}
            </div>

            <AnimatePresence>
                {selected && (
                    <ProjectModal project={selected} onClose={() => setSelected(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Projects;
