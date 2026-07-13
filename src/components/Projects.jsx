import { useState } from 'react';
import { FaGithub, FaGlobe } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, SMALL_PROJECTS } from '../constants';
import ProjectModal from './ProjectModal';

const RARITY = {
    legendary: { label: 'FEATURED', borderClass: 'rarity-legendary', color: 'text-gold-400', bg: 'bg-gold-400/5' },
    rare:      { label: 'PROJECT',  borderClass: 'rarity-rare',      color: 'text-indigo-400', bg: 'bg-indigo-400/5' },
    common:    { label: 'PROJECT',  borderClass: 'rarity-common',    color: 'text-neutral-400', bg: 'bg-neutral-800/30' },
}

const AchievementCard = ({ project, index, onOpen }) => {
    const rarity = project.featured ? RARITY.legendary : RARITY.rare;

    return (
        <motion.button
            type="button"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            onClick={() => onOpen(project)}
            className={`relative w-full max-w-[340px] border-2 ${rarity.borderClass} ${rarity.bg} p-0 text-left focus:outline-none focus:ring-2 focus:ring-gold-400/50 ${project.featured ? 'feature-pulse' : ''}`}
        >
            {/* Achievement banner */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-700/40">
                <span className={`pixel-font text-[10px] ${rarity.color}`}>{rarity.label}</span>
                <span className="pixel-font text-[10px] text-neutral-600">CLICK TO VIEW</span>
            </div>

            {/* Badge area */}
            <div className="px-5 pt-5 pb-4">
                {/* Icon placeholder / achievement icon */}
                <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 border border-current/30 flex items-center justify-center text-xl ${rarity.color}`}>
                        {project.featured ? '🏆' : '🎖'}
                    </div>
                    <div>
                        <h3 className="rpg-font text-xl text-neutral-100 leading-tight">{project.title}</h3>
                    </div>
                </div>

                <p className="text-sm text-neutral-400 leading-snug mb-4 line-clamp-2">{project.subtitle}</p>

                {/* Action links */}
                <div className="flex gap-2 flex-wrap">
                    {project.githubLink && (
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="pixel-font text-[10px] flex items-center gap-1.5 px-3 py-1.5 border border-gold-400/30 text-gold-400/80 hover:bg-gold-400/10 hover:border-gold-400/60 transition-colors"
                        >
                            <FaGithub /> GITHUB
                        </a>
                    )}
                    {project.liveLink && (
                        <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="pixel-font text-[10px] flex items-center gap-1.5 px-3 py-1.5 border border-gold-400/30 text-gold-400/80 hover:bg-gold-400/10 hover:border-gold-400/60 transition-colors"
                        >
                            <FaGlobe /> LIVE DEMO
                        </a>
                    )}
                </div>
            </div>
        </motion.button>
    );
};

const SmallCard = ({ project, index, onOpen }) => (
    <motion.button
        type="button"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 16 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, delay: index * 0.07 }}
        onClick={() => onOpen(project)}
        className="relative w-full max-w-[340px] border-2 rarity-common bg-neutral-900/40 p-0 text-left focus:outline-none focus:ring-2 focus:ring-gold-400/30"
    >
        <div className="flex items-center justify-end px-4 py-2 border-b border-neutral-700/40">
            <span className="pixel-font text-[10px] text-neutral-600">CLICK TO VIEW</span>
        </div>
        <div className="px-5 pt-4 pb-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 border border-neutral-700 flex items-center justify-center text-xl">🎮</div>
                <h3 className="rpg-font text-xl text-neutral-300 leading-tight">{project.title}</h3>
            </div>
            <p className="text-sm text-neutral-500 line-clamp-2">{project.subtitle}</p>
            {project.githubLink && (
                <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="pixel-font text-[10px] inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 border border-neutral-700 text-neutral-500 hover:border-gold-400/40 hover:text-gold-400/70 transition-colors"
                >
                    <FaGithub /> GITHUB
                </a>
            )}
        </div>
    </motion.button>
);

const Projects = () => {
    const [selected, setSelected] = useState(null);

    return (
        <div className="pb-4">
            {/* Section header */}
            <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="my-10 text-center flex flex-col items-center gap-3"
            >
                <span className="pixel-font text-[11px] text-gold-400/60 tracking-[0.15em] w-full">◄ PROJECTS ►</span>
                <h1 className="rpg-font text-4xl sm:text-5xl lg:text-6xl text-gold-400 tracking-wider w-full">PROJECTS</h1>
                <div className="h-0.5 w-32 bg-gold-400/40" />
            </motion.div>

            <div className="max-w-5xl mx-auto px-2 flex flex-col items-center gap-10">
                {/* Featured projects */}
                <div>
                    <p className="pixel-font text-[10px] text-gold-400/50 text-center mb-5 tracking-widest">FEATURED PROJECTS</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {PROJECTS.map((p, i) => (
                            <AchievementCard key={p.title} project={p} index={i} onOpen={setSelected} />
                        ))}
                    </div>
                </div>

                {/* Other projects */}
                <div>
                    <p className="pixel-font text-[10px] text-neutral-600 text-center mb-5 tracking-widest">OTHER PROJECTS</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {SMALL_PROJECTS.map((p, i) => (
                            <SmallCard key={p.title} project={p} index={i} onOpen={setSelected} />
                        ))}
                    </div>
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
