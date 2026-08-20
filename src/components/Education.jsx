import { EDUCATION } from "../constants"

const Education = () => (
    <div className="flex flex-col gap-4">
        {EDUCATION.map((edu) => (
            <div
                key={edu.school}
                className="bg-term-panel2 border-l-[3px] border-acc-cyan px-[18px] py-4 flex items-start gap-3"
            >
                {edu.logo && (
                    <img
                        src={edu.logo}
                        alt={edu.school}
                        className="w-10 h-10 border-2 border-term-outline bg-term-panel p-1 object-contain flex-shrink-0"
                    />
                )}
                <div>
                    <div className="font-mono text-xs text-acc-cyan">{edu.year}</div>
                    <div className="font-mono text-sm font-bold text-term-text">{edu.degree}</div>
                    <div className="font-sans text-sm text-term-muted">{edu.school}</div>
                    <div className="font-mono text-xs text-acc-purple">{edu.description}</div>
                </div>
            </div>
        ))}
    </div>
)

export default Education
