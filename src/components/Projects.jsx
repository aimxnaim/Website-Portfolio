import { useState } from 'react';
import { FaGithub, FaGlobe } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, SMALL_PROJECTS } from '../constants';
import ProjectModal from './ProjectModal';

const cardVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
};

const Projects = () => {
    const [selected, setSelected] = useState(null);

    const renderCard = (project, index) => {
        const isFeatured = project.featured;
        const subtitle = project.subtitle;

        return (
            <motion.button
                type="button"
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
                key={`${project.title}-${index}`}
                onClick={() => setSelected(project)}
                className={`relative w-full max-w-[360px] rounded-3xl border bg-neutral-900/80 px-6 pt-16 pb-8 shadow-lg text-center focus:outline-none focus:ring-2 focus:ring-purple-400/70 ${
                    isFeatured ? "border-purple-500 shadow-purple-900/40 feature-pulse" : "border-neutral-800"
                }`}
            >
                {/* {isFeatured && !compact && <span className="absolute inset-0 rounded-3xl border border-purple-400/40 pointer-events-none" aria-hidden />} */}

                <div className="absolute top-3 left-0 right-0 z-10 px-4 mt-1">
                    <div className="flex items-center">
                        <span className="flex-1 h-px bg-neutral-700" aria-hidden />
                        <div className="mx-3 px-4 py-2 rounded-xl bg-neutral-800/90 border border-purple-500/50 text-sm font-semibold text-neutral-50 shadow shadow-purple-900/30">
                            {project.title}
                        </div>
                        <span className="flex-1 h-px bg-neutral-700" aria-hidden />
                    </div>
                </div>

                <div className="mt-2 min-h-[78px] flex items-center justify-center">
                    <p className="text-base text-neutral-200 leading-relaxed line-clamp-3">{subtitle}</p>
                </div>

                <div className="mt-5 flex justify-center gap-3 text-sm font-medium">
                    {project.githubLink && (
                        <a
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-4 py-2 hover:border-purple-400 hover:text-purple-200 transition"
                            href={project.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaGithub /> GitHub
                        </a>
                    )}
                    { project.liveLink && (
                        <a
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-4 py-2 hover:border-purple-400 hover:text-purple-200 transition"
                            href={project.liveLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaGlobe /> Website
                        </a>
                    )}
                </div>
            </motion.button>
        );
    };

    return (
        <div className="pb-4">
            <motion.div
                id='projects'
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="my-16 text-center flex flex-col items-center gap-3"
            >
                <h1 className="text-5xl font-semibold bg-gradient-to-r from-purple-200 via-purple-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(109,40,217,0.35)]">
                    Projects
                </h1>
                <div className="h-1 w-24 rounded-full bg-purple-500/70 shadow shadow-purple-500/40" />
            </motion.div>

            <div className="max mx-auto px-4 flex flex-col items-center gap-12">
                    <div className="w-full flex flex-wrap justify-center gap-12">
                        {PROJECTS.map((p, i) => renderCard(p, i))}
                    </div>

                    <h2 className="mt-4 text-center text-2xl">Small Projects</h2>
                    <div className="w-full flex flex-wrap justify-center gap-12">
                        {SMALL_PROJECTS.map((p, i) => renderCard(p, i))}
                    </div>
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
