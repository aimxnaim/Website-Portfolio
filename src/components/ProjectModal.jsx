import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaGlobe, FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

const backdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

const modal = {
  initial: { opacity: 0, scale: 0.97, y: 12 },
  animate: { opacity: 1, scale: 1,    y: 0 },
  exit:    { opacity: 0, scale: 0.97, y: -8 },
};

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!project) return null;

  const isArrayDesc = Array.isArray(project.description);

  return (
    <motion.div
      variants={backdrop}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modal}
        transition={{ duration: 0.2 }}
        className="relative mx-auto w-full max-w-3xl rpg-panel text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal chrome bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gold-400/30 bg-gold-400/5">
          <div className="flex items-center gap-3">
            <span className="text-gold-400 text-base">📋</span>
            <span className="pixel-font text-[8px] text-gold-400 tracking-widest">QUEST DETAILS</span>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rpg-panel-dim p-2 text-neutral-400 hover:text-gold-400 hover:border-gold-400/50 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto scrollbar-modal p-4 sm:p-6">
          {/* Title + links */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="rpg-font text-3xl sm:text-4xl text-gold-400">{project.title}</h2>
              {project.subtitle && (
                <p className="rpg-font text-xl text-neutral-400 mt-1">{project.subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  className="rpg-panel-dim p-2 text-neutral-400 hover:text-gold-400 hover:border-gold-400/50 transition-colors"
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub"
                >
                  <FaGithub className="text-lg" />
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  className="rpg-panel-dim p-2 text-neutral-400 hover:text-gold-400 hover:border-gold-400/50 transition-colors"
                  target="_blank"
                  rel="noreferrer"
                  title="Live Demo"
                >
                  <FaGlobe className="text-lg" />
                </a>
              )}
            </div>
          </div>

          {/* Screenshot */}
          {project.image && (
            <div className="mb-5 border-2 border-gold-400/20 p-1">
              <img
                src={project.image}
                alt={project.title}
                className="w-full"
              />
              <p className="pixel-font text-[6px] text-gold-400/40 text-center mt-1 pb-0.5">QUEST PREVIEW</p>
            </div>
          )}

          {/* Technologies */}
          {project.technologies && (
            <div className="mb-5">
              <p className="pixel-font text-[7px] text-gold-400/60 mb-2 tracking-widest">SKILLS USED</p>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((t, i) => (
                  <span key={i} className="pixel-font text-[6px] px-2 py-1 text-green-300 bg-green-500/10 border border-green-500/30">
                    +{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="pixel-font text-[7px] text-gold-400/60 mb-3 tracking-widest">QUEST DESCRIPTION</p>
            {isArrayDesc ? (
              <ul className="space-y-3">
                {project.description.map((desc, i) => (
                  <li key={i} className="flex items-start gap-2 text-neutral-300">
                    <span className="text-gold-400 mt-1 flex-shrink-0 text-xs">►</span>
                    <span className="rpg-font text-lg leading-snug">{desc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rpg-font text-xl text-neutral-300 leading-relaxed">{project.description}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gold-400/20 flex justify-between items-center">
          <span className="pixel-font text-[7px] text-neutral-600">ESC TO CLOSE</span>
          <span className="blink pixel-font text-[7px] text-gold-400/60">▼</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

ProjectModal.propTypes = {
  project: PropTypes.shape({
    title:       PropTypes.string.isRequired,
    subtitle:    PropTypes.string,
    image:       PropTypes.any,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    technologies:PropTypes.arrayOf(PropTypes.string),
    githubLink:  PropTypes.string,
    liveLink:    PropTypes.string,
    featured:    PropTypes.bool,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProjectModal;
