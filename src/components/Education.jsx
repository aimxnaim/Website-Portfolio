import { EDUCATION } from "../constants";
import { motion } from "framer-motion";

const Education = () => {
  return (
    <div className="pb-4">
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 1, delay: 0.05 }}
        className="my-12 text-center flex flex-col items-center gap-3"
      >
        <h1 className="text-5xl font-semibold bg-gradient-to-r from-purple-200 via-purple-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(109,40,217,0.35)]">
          Education
        </h1>
        <div className="h-1 w-24 rounded-full bg-purple-500/70 shadow shadow-purple-500/40" />
      </motion.div>

      {EDUCATION.map((education, index) => (
        <div key={index} className="mb-8 flex flex-wrap lg:justify-center">
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/4"
          >
            <p className="mb-2 text-sm text-neutral-400">{education.year}</p>
          </motion.div>
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-xl lg:w-3/4"
          >
            <h6 className="mb-1 font-semibold">
              {education.degree} - {" "}
              <span className="text-sm text-purple-50">{education.school}</span>
            </h6>
            <p className="text-neutral-400">{education.description}</p>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default Education;
