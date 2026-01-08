import { EDUCATION } from "../constants";
import { motion } from "framer-motion";

const Education = () => {
  return (
    <div className="pb-4">
      <motion.h1
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 1 }}
        className="my-10 text-center text-3xl"
      >
        Education
      </motion.h1>

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
