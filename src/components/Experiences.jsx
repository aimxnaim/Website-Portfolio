import { EXPERIENCES } from "../constants"
import { motion } from "framer-motion"

const parseMonthYear = (str) => {
    const [month, year] = str.split(" ");
    return new Date(`${month} 1, ${year}`);
};

const formatDuration = (startStr, endStr) => {
    const start = parseMonthYear(startStr);
    const end = endStr.toLowerCase().includes("current") ? new Date() : parseMonthYear(endStr);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const yrs = Math.floor(months / 12);
    const mos = months % 12;
    const yrPart = yrs > 0 ? `${yrs}yr` : "";
    const moPart = mos > 0 ? `${mos}mo` : "";
    return `${yrPart}${yrPart && moPart ? " " : ""}${moPart}` || "0mo";
};

const Experiences = () => {
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
                <span className="pixel-font text-[11px] text-gold-400/60 tracking-[0.15em] w-full">◄ CAREER ►</span>
                <h1 className="rpg-font text-4xl sm:text-5xl lg:text-6xl text-gold-400 tracking-wider w-full">CAREER</h1>
                <div className="h-0.5 w-32 bg-gold-400/40" />
            </motion.div>

            <div className="max-w-4xl mx-auto flex flex-col gap-6">
                {EXPERIENCES.map((experience, index) => {
                    const [start, end] = experience.year.split(" - ");
                    const isCurrent = end.toLowerCase().includes("current");
                    const duration = formatDuration(start, end);

                    return (
                        <motion.div
                            key={index}
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`rpg-panel-dim p-0 overflow-hidden ${isCurrent ? 'border-green-500/50' : ''}`}
                            style={isCurrent ? { borderColor: 'rgba(34,197,94,0.5)' } : {}}
                        >
                            {/* Quest header bar */}
                            <div className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5 border-b ${isCurrent ? 'border-green-500/30 bg-green-500/5' : 'border-gold-400/15 bg-gold-400/5'}`}>
                                <div className="flex items-center gap-3">
                                    <span className={`pixel-font text-[10px] px-2 py-1 ${isCurrent ? 'badge-active' : 'badge-completed'}`}>
                                        {isCurrent ? '▶ CURRENT' : '✓ PAST'}
                                    </span>
                                    <span className="rpg-font text-xl text-neutral-300">{experience.year}</span>
                                </div>
                                <span className="pixel-font text-[10px] text-gold-400/60 bg-gold-400/10 border border-gold-400/25 px-2 py-1">
                                    {duration}
                                </span>
                            </div>

                            <div className="flex gap-4 p-4 sm:p-5">
                                {/* Company logo as "quest giver" */}
                                <div className="flex-shrink-0">
                                    <div className="rpg-panel-sm w-16 h-16 flex items-center justify-center p-2">
                                        <img
                                            src={experience.image}
                                            alt={experience.company}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <p className="pixel-font text-[10px] text-gold-400/50 text-center mt-1 leading-tight">COMPANY</p>
                                </div>

                                {/* Quest details */}
                                <div className="flex-1 min-w-0">
                                    <div className="mb-3">
                                        <h6 className="rpg-font text-2xl text-gold-400">{experience.role}</h6>
                                        <p className="pixel-font text-[11px] text-neutral-400 mt-0.5">{experience.company}</p>
                                    </div>

                                    {/* Highlights */}
                                    <div className="mb-4">
                                        <p className="pixel-font text-[10px] text-gold-400/60 mb-2">HIGHLIGHTS</p>
                                        <ul className="space-y-2">
                                            {experience.description.map((desc, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-neutral-300">
                                                    <span className="text-gold-400 mt-1 flex-shrink-0 text-xs">►</span>
                                                    <span className="text-sm sm:text-base leading-relaxed">{desc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Tech stack */}
                                    <div>
                                        <p className="pixel-font text-[10px] text-gold-400/60 mb-2">SKILLS USED</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {experience.technologies.map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="pixel-font text-[10px] px-2 py-1 text-green-300 bg-green-500/10 border border-green-500/30"
                                                >
                                                    +{tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Experiences;
