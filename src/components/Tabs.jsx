import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaCogs, FaBriefcase, FaFolderOpen } from "react-icons/fa";
import Education from "./Education";
import Technology from "./Technology";
import Experiences from "./Experiences";
import Projects from "./Projects";

const tabs = [
  { id: "education", label: "Education", icon: FaGraduationCap, component: Education },
  { id: "tech", label: "Tech Stack", icon: FaCogs, component: Technology },
  { id: "experience", label: "Working Experience", icon: FaBriefcase, component: Experiences },
  { id: "projects", label: "Past Project", icon: FaFolderOpen, component: Projects },
];

const Tabs = () => {
  const [active, setActive] = useState("education");
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
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-purple-600/20 text-purple-200 border border-purple-600"
                    : "bg-neutral-900 text-neutral-300 border border-neutral-800"
                }`}
              >
                <Icon className={isActive ? "text-purple-400" : "text-neutral-400"} />
                <span>{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="relative mx-auto mt-6 w-full rounded-2xl border border-neutral-800 bg-black/20 p-4">
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
