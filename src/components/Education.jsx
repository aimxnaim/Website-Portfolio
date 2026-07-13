import { Fragment } from "react";
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
      <div className="max-w-2xl mx-auto grid grid-cols-[68px_1fr] sm:grid-cols-[80px_1fr] gap-x-3 sm:gap-x-4 gap-y-0">
        {[...EDUCATION].reverse().map((education, index) => {
          const isLast = index === EDUCATION.length - 1
          const Icon = STAGE_ICONS[index]
          return (
            <Fragment key={index}>
              {/* Rail: logo/icon node + connecting line down to the next stage */}
              <div className="flex flex-col items-center">
                <div className="rpg-panel-sm w-[68px] h-[68px] sm:w-20 sm:h-20 p-1.5 flex items-center justify-center flex-shrink-0">
                  {education.logo ? (
                    <div className="w-full h-full rounded bg-white flex items-center justify-center overflow-hidden">
                      <img src={education.logo} alt={education.school} className="w-full h-full object-contain p-0.5" />
                    </div>
                  ) : (
                    <Icon className="text-3xl text-gold-400/80" />
                  )}
                </div>
                {!isLast && (
                  <div className="flex-1 flex flex-col items-center py-2 gap-1.5 min-h-[40px]">
                    <div className={`timeline-line flex-1 ${index === 0 ? '' : ''}`} />
                    <span className={`timeline-gem ${index === EDUCATION.length - 2 ? 'is-goal' : ''}`} />
                    <div className={`timeline-line flex-1 ${index === EDUCATION.length - 2 ? 'is-goal' : ''}`} />
                  </div>
                )}
              </div>

              {/* Card */}
              <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                viewport={{ once: true }}
                className={`rpg-panel-dim p-0 overflow-hidden mb-3 sm:mb-4 ${isLast ? 'border-green-500/50' : ''}`}
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
                <div className="p-4 sm:p-5">
                  <h6 className="rpg-font text-xl sm:text-2xl text-gold-400 leading-tight">{education.degree}</h6>
                  <p className="pixel-font text-[9px] text-neutral-400 mt-1">{education.school}</p>
                  <span className="inline-flex items-center gap-1.5 mt-3 pixel-font text-[8px] px-2 py-1 text-green-300 bg-green-500/10 border border-green-500/30">
                    ★ {education.description}
                  </span>
                </div>
              </motion.div>
            </Fragment>
          )
        })}
      </div>
    </div>
  );
};

export default Education;
