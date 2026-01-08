import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaGlobe, FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

const backdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const modal = {
  initial: { opacity: 0, scale: 0.98, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: -6 },
};

const ProjectModal = ({ project, onClose }) => {
  // Close on Esc key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <motion.div
        variants={modal}
        transition={{ duration: 0.2 }}
        className="relative mx-4 w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-neutral-700 p-2 hover:bg-neutral-800"
        >
          <FaTimes />
        </button>

        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-2xl font-semibold">{project.title}</h2>
          <div className="ml-4 flex items-center gap-3">
            {project.githubLink && (
              <a
                href={project.githubLink}
                className="rounded-full border border-neutral-700 p-2 hover:bg-neutral-800"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub />
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                className="rounded-full border border-neutral-700 p-2 hover:bg-neutral-800"
                target="_blank"
                rel="noreferrer"
              >
                <FaGlobe />
              </a>
            )}
          </div>
        </div>

        <div className="max-h-[80vh] overflow-y-auto pr-1">
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="mb-4 w-full rounded-lg border border-neutral-800"
            />
          )}

          {isArrayDesc ? (
            <ul className="space-y-3 text-gray-300">
              {project.description.map((desc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="mt-1 text-purple-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m10 16 4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">{project.description}</p>
          )}

          {project.technologies && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((t, i) => (
                <span key={i} className="text-sm bg-neutral-800 text-purple-400 px-2 py-1 rounded-lg border border-neutral-700">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;

ProjectModal.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.any,
    description: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string),
    githubLink: PropTypes.string,
    liveLink: PropTypes.string,
    featured: PropTypes.bool,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
