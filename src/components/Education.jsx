import { EDUCATION } from "../constants";
import { motion } from "framer-motion";
import { FaSchool, FaBookOpen, FaGraduationCap } from "react-icons/fa";

const STAGE_ICONS = [FaSchool, FaBookOpen, FaGraduationCap];
const STAGE_LABELS = ['SECONDARY SCHOOL', 'MATRICULATION', 'UNIVERSITY'];

const Education = () => {
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
        <span className="pixel-font text-[9px] text-gold-400/60 tracking-[0.15em] w-full">◄ EDUCATION ►</span>
        <h1 className="rpg-font text-4xl sm:text-5xl lg:text-6xl text-gold-400 tracking-wider w-full">EDUCATION</h1>
        <div className="h-0.5 w-32 bg-gold-400/40" />
      </motion.div>

      {/* Intro */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="dialog-box max-w-2xl mx-auto mb-8"
      >
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          My academic background before becoming a Full Stack Developer.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-2xl mx-auto flex flex-col gap-3 sm:gap-4">
        {[...EDUCATION].reverse().map((education, index) => {
          const isLast = index === EDUCATION.length - 1
          const Icon = STAGE_ICONS[index]
          return (
            <motion.div key={index}>
              <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                viewport={{ once: true }}
                className={`rpg-panel-dim p-0 overflow-hidden ${isLast ? 'border-green-500/50' : ''}`}
                style={isLast ? { borderColor: 'rgba(34,197,94,0.5)' } : {}}
              >
                {/* Header bar */}
                <div className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5 border-b ${isLast ? 'border-green-500/30 bg-green-500/5' : 'border-gold-400/15 bg-gold-400/5'}`}>
                  <span className={`pixel-font text-[8px] px-2 py-1 ${isLast ? 'badge-active' : 'badge-completed'}`}>
                    {STAGE_LABELS[index]}
                  </span>
                  <span className="pixel-font text-[8px] text-gold-400/60 bg-gold-400/10 border border-gold-400/25 px-2 py-1">
                    {education.year}
                  </span>
                </div>

                {/* Body */}
                <div className="flex gap-3 sm:gap-4 p-4 sm:p-5">
                  <div className="flex-shrink-0">
                    <div className="rpg-panel-sm w-14 h-14 flex items-center justify-center">
                      <Icon className="text-2xl text-gold-400/80" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h6 className="rpg-font text-xl sm:text-2xl text-gold-400 leading-tight">{education.degree}</h6>
                    <p className="pixel-font text-[9px] text-neutral-400 mt-1">{education.school}</p>
                    <span className="inline-flex items-center gap-1.5 mt-3 pixel-font text-[8px] px-2 py-1 text-green-300 bg-green-500/10 border border-green-500/30">
                      ★ {education.description}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Flow connector to next stage */}
              {!isLast && (
                <div className="w-14 flex flex-col items-center py-1">
                  <div className="w-px h-3 bg-gradient-to-b from-gold-400/40 to-gold-400/10" />
                  <span className="text-gold-400/50 text-xs leading-none">▼</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  );
};

export default Education;
