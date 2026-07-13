import { EDUCATION } from "../constants";
import { motion } from "framer-motion";

const CHAPTER_ICONS = ['📖', '📜', '🎓', '📌'];

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

      {/* Timeline chapters */}
      <div className="max-w-2xl mx-auto flex flex-col gap-3 sm:gap-4">
        {[...EDUCATION].reverse().map((education, index) => {
          const isLast = index === EDUCATION.length - 1
          return (
            <motion.div key={index}>
              <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                viewport={{ once: true }}
                className="flex gap-3 sm:gap-4"
              >
                {/* Chapter marker */}
                <div className="flex-shrink-0">
                  <div className="rpg-panel-sm w-12 h-12 flex items-center justify-center text-xl">
                    {CHAPTER_ICONS[index]}
                  </div>
                </div>

                {/* Chapter content */}
                <div className="rpg-panel-dim p-4 flex-1">
                  <div className="flex items-center justify-end flex-wrap gap-2 mb-2">
                    <span className="pixel-font text-[8px] text-neutral-500 border border-gold-400/20 bg-gold-400/5 px-2 py-1">
                      {education.year}
                    </span>
                  </div>
                  <h6 className="rpg-font text-2xl text-gold-400 leading-tight">{education.degree}</h6>
                  <p className="pixel-font text-[9px] text-neutral-400 mt-1">{education.school}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-gold-400 text-xs">★</span>
                    <p className="text-sm text-green-400">{education.description}</p>
                  </div>
                </div>
              </motion.div>

              {/* Flow connector to next stage */}
              {!isLast && (
                <div className="w-12 flex flex-col items-center py-1">
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
