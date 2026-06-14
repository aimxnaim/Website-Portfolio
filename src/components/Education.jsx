import { EDUCATION } from "../constants";
import { motion } from "framer-motion";

const CHAPTER_ICONS = ['📖', '📜', '🎓'];
const CHAPTER_LABELS = ['CHAPTER III', 'CHAPTER II', 'CHAPTER I'];

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
        <span className="pixel-font text-[9px] text-gold-400/60 tracking-[0.3em]">◄ BACKSTORY ►</span>
        <h1 className="rpg-font text-5xl lg:text-6xl text-gold-400 tracking-wider">ORIGIN STORY</h1>
        <div className="h-0.5 w-32 bg-gold-400/40" />
      </motion.div>

      {/* Intro dialog */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="dialog-box max-w-2xl mx-auto mb-8"
      >
        <p className="pixel-font text-[7px] text-gold-400/60 mb-2">NARRATOR</p>
        <p className="rpg-font text-xl text-neutral-300 leading-relaxed">
          Before becoming a Full Stack Developer, our hero walked a long road of knowledge and discipline...
        </p>
      </motion.div>

      {/* Timeline chapters */}
      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        {[...EDUCATION].reverse().map((education, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            {/* Chapter marker */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="rpg-panel-sm w-12 h-12 flex items-center justify-center text-xl">
                {CHAPTER_ICONS[index]}
              </div>
              {index < EDUCATION.length - 1 && (
                <div className="w-px flex-1 bg-gold-400/20 mt-2" />
              )}
            </div>

            {/* Chapter content */}
            <div className="rpg-panel-dim p-4 flex-1 mb-2">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="pixel-font text-[7px] text-gold-400/60">{CHAPTER_LABELS[index]}</span>
                <span className="pixel-font text-[7px] text-neutral-500 border border-gold-400/20 bg-gold-400/5 px-2 py-1">
                  {education.year}
                </span>
              </div>
              <h6 className="rpg-font text-2xl text-gold-400 leading-tight">{education.degree}</h6>
              <p className="pixel-font text-[8px] text-neutral-400 mt-1">{education.school}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-gold-400 text-xs">★</span>
                <p className="rpg-font text-lg text-green-400">{education.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Education;
