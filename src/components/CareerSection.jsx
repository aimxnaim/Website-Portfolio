import { EXPERIENCES } from "../constants"
import ProcessRow from "./ProcessRow"
import { pidFor } from "../lib/pid"

const CareerSection = () => (
    <div className="flex flex-col gap-4">
        {EXPERIENCES.map((exp, i) => {
            const isCurrent = exp.year.toLowerCase().includes("current")
            const bullets = Array.isArray(exp.description) ? exp.description : [exp.description]
            return (
                <ProcessRow
                    key={exp.company}
                    pid={pidFor(i)}
                    name={exp.company}
                    badge={isCurrent
                        ? { label: "RUNNING", tone: "running" }
                        : { label: "COMPLETED", tone: "stable" }}
                    sub={`${exp.role} — ${exp.year.replace(" - ", " · ")}`}
                    bullets={bullets}
                    tags={exp.technologies}
                    image={exp.image}
                    imageAlt={exp.company}
                />
            )
        })}
    </div>
)

export default CareerSection
