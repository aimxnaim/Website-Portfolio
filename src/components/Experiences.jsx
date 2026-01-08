import { EXPERIENCES } from "../constants"
import { motion } from "framer-motion"

const Experiences = () => {
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
        const yrPart = yrs > 0 ? `${yrs} yr${yrs > 1 ? "s" : ""}` : "";
        const moPart = mos > 0 ? `${mos} mo${mos > 1 ? "s" : ""}` : "";
        return `${yrPart}${yrPart && moPart ? " " : ""}${moPart}` || "0 mos";
    };

    return (
        <div className="border-b border-neutral-900 pb-4">
            <motion.div
                id="experience"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="my-16 text-center flex flex-col items-center gap-3"
            >
                <h1 className="text-5xl font-semibold bg-gradient-to-r from-purple-200 via-purple-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(109,40,217,0.35)]">
                    Experience
                </h1>
                <div className="h-1 w-24 rounded-full bg-purple-500/70 shadow shadow-purple-500/40" />
            </motion.div>
            <div className="max-w-6xl mx-auto">
                <div className="relative">
                    {/* Vertical timeline spine */}
                    <div className="absolute left-10 sm:left-12 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500/60 via-purple-500/20 to-transparent rounded-full" aria-hidden />
                    
                    {EXPERIENCES.map((experience, index) => {
                        const [start, end] = experience.year.split(" - ");
                        const isCurrent = end.toLowerCase().includes("current");
                        const duration = formatDuration(start, end);
                        // const isLast = index === EXPERIENCES.length - 1;
                        return (
                            <div key={index} className="relative pb-16 pl-0">
                                <div className="flex items-start gap-0">
                                    {/* Company logo box - centered on timeline */}
                                    <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-purple-500/40 bg-neutral-950 p-3 shadow-lg flex items-center justify-center overflow-hidden z-10">
                                        <img
                                            src={experience.image}
                                            alt={experience.company}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Connecting line from logo to card */}
                                    <div className="relative flex-shrink-0 w-8 sm:w-12 h-20 sm:h-24 flex items-center">
                                        <div className="w-full h-[2px] bg-gradient-to-r from-purple-500/50 to-purple-500/20" aria-hidden />
                                    </div>

                                    {/* Experience card */}
                                    <div className="flex-1 flex flex-col gap-2 bg-neutral-900/60 rounded-2xl border border-purple-500/20 p-5 shadow-lg">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h6 className="font-semibold text-lg text-purple-100">
                                        {experience.role} - {experience.company}
                                    </h6>
                                    {isCurrent && (
                                        <span className="px-2.5 py-1 text-xs rounded-full bg-green-500/20 text-green-200 border border-green-500/40">Current</span>
                                    )}
                                    <span className="text-sm text-neutral-400">{duration}</span>
                                </div>
                                <div className="text-sm text-neutral-400">{experience.year}</div>

                                <ul className="my-2 space-y-2 text-neutral-300 list-none">
                                    {experience.description.map((desc, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <svg className="mt-1 text-purple-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="m10 16 4-4-4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            <span>{desc}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex flex-wrap">
                                    {experience.technologies.map((technology, idx) => (
                                        <span
                                            key={idx}
                                            className="m-1 ml-0 text-sm px-3 py-1 rounded-full font-medium bg-purple-900/30 text-purple-100 border border-purple-500/40 shadow shadow-purple-900/20"
                                        >
                                            {technology}
                                        </span>
                                    ))}
                                </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Experiences