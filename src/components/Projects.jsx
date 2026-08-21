import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { EXPERIENCES, PROJECTS, SMALL_PROJECTS } from "../constants"
import ProcessRow from "./ProcessRow"
import { pidFor } from "../lib/pid"
import ProjectModal from "./ProjectModal"

// Career rows seed PIDs from their own index (Task 12); project rows seed
// from EXPERIENCES.length + index so the two lists never collide.
const ALL_PROJECTS = [...PROJECTS, ...SMALL_PROJECTS]

const Projects = () => {
    const [selected, setSelected] = useState(null)

    return (
        <div className="flex flex-col gap-4">
            {ALL_PROJECTS.map((project, i) => {
                // description is a plain string for two SMALL_PROJECTS entries
                // and a string array for the rest — normalise before handing
                // it to ProcessRow, whose bullets guard (`bullets.length > 0`)
                // would otherwise pass a string straight into `.map`.
                const bullets = Array.isArray(project.description) ? project.description : [project.description]

                const links = [
                    project.githubLink && { label: "GITHUB", href: project.githubLink },
                    project.liveLink && { label: "LIVE DEMO", href: project.liveLink },
                ].filter(Boolean)

                return (
                    <ProcessRow
                        key={project.title}
                        pid={pidFor(EXPERIENCES.length + i)}
                        name={project.title}
                        badge={project.liveLink
                            ? { label: "LIVE", tone: "shipped" }
                            : { label: "CODE", tone: "progress" }}
                        sub={project.subtitle}
                        bullets={bullets}
                        tags={project.technologies}
                        links={links}
                        image={project.image}
                        imageAlt={project.title}
                        imageVariant="screenshot"
                        onClick={() => setSelected(project)}
                    />
                )
            })}

            <AnimatePresence>
                {selected && (
                    <ProjectModal project={selected} onClose={() => setSelected(null)} />
                )}
            </AnimatePresence>
        </div>
    )
}

export default Projects
