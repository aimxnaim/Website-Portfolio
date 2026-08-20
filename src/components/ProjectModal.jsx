import { useEffect } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import { FaGithub, FaGlobe, FaTimes } from "react-icons/fa"
import PropTypes from "prop-types"
import PixelWindow from "./PixelWindow"
import useReducedMotion from "../hooks/useReducedMotion"

const backdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
}

const modal = {
  initial: { opacity: 0, scale: 0.97, y: 12 },
  animate: { opacity: 1, scale: 1,    y: 0 },
  exit:    { opacity: 0, scale: 0.97, y: -8 },
}

const ProjectModal = ({ project, onClose }) => {
  const reduced = useReducedMotion()

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  if (!project) return null

  const bullets = Array.isArray(project.description) ? project.description : [project.description]

  return createPortal(
    <motion.div
      variants={backdrop}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: reduced ? 0 : 0.2 }}
      // The scanline overlay (body.term-theme::after) sits at z-index: 55.
      // App.jsx's content container is a non-positioned box, so without an
      // explicit position + higher z-index here the modal paints beneath
      // the scanlines by normal stacking order. z-[150] clears both that
      // (55) and the scroll-progress bar (100).
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        variants={reduced ? backdrop : modal}
        transition={{ duration: reduced ? 0 : 0.2 }}
        className="relative mx-auto w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <PixelWindow innerClassName="flex flex-col max-h-[85vh]">
          <div className="win-bar justify-between">
            <div className="flex items-center gap-1.5">
              <span className="dot dot-red" aria-hidden="true" />
              <span className="dot dot-amber" aria-hidden="true" />
              <span className="dot dot-green" aria-hidden="true" />
              <span className="ml-1.5 font-mono text-xs text-term-muted">project.details</span>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="text-term-muted hover:text-acc-red transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          <div className="max-h-[80vh] overflow-y-auto scrollbar-modal p-4 sm:p-6">
            {/* Title + links */}
            <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
              <div>
                <h2 className="font-mono text-xl sm:text-2xl font-bold text-term-text">{project.title}</h2>
                {project.subtitle && (
                  <p className="font-mono text-xs text-term-muted mt-1">{project.subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-acc-green hover:underline inline-flex items-center gap-1.5"
                  >
                    <FaGithub /> GITHUB
                  </a>
                )}
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-acc-green hover:underline inline-flex items-center gap-1.5"
                  >
                    <FaGlobe /> LIVE DEMO
                  </a>
                )}
              </div>
            </div>

            {/* Screenshot */}
            {project.image && (
              <div className="mb-5 border-2 border-term-outline bg-term-panel2 p-1">
                <img src={project.image} alt={project.title} className="w-full" />
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-5">
                <p className="font-pixel text-label text-term-muted tracking-[0.08em] mb-2">SKILLS USED</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs px-2 py-0.5 bg-term-panel2 border-2 border-term-outline text-term-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <p className="font-pixel text-label text-term-muted tracking-[0.08em] mb-3">OVERVIEW</p>
              <ul className="space-y-3">
                {bullets.map((desc) => (
                  <li key={desc} className="flex items-start gap-2">
                    <span className="text-acc-green mt-1 flex-shrink-0 text-xs">►</span>
                    <span className="font-sans text-sm text-term-muted leading-relaxed">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t-2 border-term-outline flex justify-between items-center">
            <span className="font-mono text-xs text-term-muted">ESC TO CLOSE</span>
            <span className="term-cursor" aria-hidden="true" />
          </div>
        </PixelWindow>
      </motion.div>
    </motion.div>,
    document.body
  )
}

ProjectModal.propTypes = {
  project: PropTypes.shape({
    title:        PropTypes.string.isRequired,
    subtitle:     PropTypes.string,
    image:        PropTypes.any,
    description:  PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string),
    githubLink:   PropTypes.string,
    liveLink:     PropTypes.string,
    featured:     PropTypes.bool,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ProjectModal
