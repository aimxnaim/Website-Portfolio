import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaCogs, FaBriefcase, FaFolderOpen } from "react-icons/fa";
import Education from "./Education";
import Technology from "./Technology";
import Experiences from "./Experiences";
import Projects from "./Projects";

const tabs = [
  { id: "experience", label: "Working Experience", icon: FaBriefcase, component: Experiences },
  { id: "projects", label: "Past Project", icon: FaFolderOpen, component: Projects },
  { id: "education", label: "Education", icon: FaGraduationCap, component: Education },
  { id: "tech", label: "Tech Stack", icon: FaCogs, component: Technology },
];

const Tabs = () => {
  const [active, setActive] = useState("experience");
  const ActiveComponent = tabs.find((t) => t.id === active)?.component || Education;

  return (
    <div className="border-b border-neutral-900 pb-10">
      <div className="mx-auto mb-6 w-full">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = id === active;
            return (
              <motion.button
                key={id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActive(id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                  isActive
                    ? "bg-purple-600 text-white border border-purple-500 shadow-md shadow-purple-800/30"
                    : "bg-neutral-800 text-neutral-200 border border-neutral-600 hover:bg-neutral-700 hover:text-white hover:border-neutral-500"
                }`}
              >
                <Icon className={isActive ? "text-white" : "text-neutral-300"} />
                <span>{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="relative mx-auto mt-6 w-full rounded-2xl border border-neutral-700 bg-neutral-900/75 p-6 shadow-lg shadow-black/30 ring-1 ring-purple-500/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
