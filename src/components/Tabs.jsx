import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaCogs, FaBriefcase, FaFolderOpen } from "react-icons/fa";
import Education from "./Education";
import Technology from "./Technology";
import Experiences from "./Experiences";
import Projects from "./Projects";

const tabs = [
  { id: "workingExperience", label: "QUEST LOG",      shortLabel: "QUESTS",  icon: FaBriefcase,    component: Experiences },
  { id: "projects",          label: "ACHIEVEMENTS",   shortLabel: "ACHIEVE", icon: FaFolderOpen,   component: Projects },
  { id: "education",         label: "ORIGIN STORY",   shortLabel: "ORIGIN",  icon: FaGraduationCap,component: Education },
  { id: "tech",              label: "SKILL TREE",     shortLabel: "SKILLS",  icon: FaCogs,         component: Technology },
];

const Tabs = () => {
  const [active, setActive] = useState("workingExperience");
  const ActiveComponent = tabs.find((t) => t.id === active)?.component || Experiences;

  return (
    <div className="border-b-2 border-gold-400/15 pb-12">
      {/* RPG Menu bar */}
      <div className="mx-auto mb-6 w-full">
        {/* Menu label */}
        <div className="flex justify-center mb-4">
          <span className="pixel-font text-[8px] text-gold-400/50 tracking-widest">◄ MAIN MENU ►</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {tabs.map(({ id, label, shortLabel, icon: Icon }) => {
            const isActive = id === active;
            return (
              <motion.button
                key={id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActive(id)}
                className={`rpg-menu-btn flex items-center gap-2 px-4 py-2.5 ${isActive ? 'active' : ''}`}
              >
                {isActive && <span className="text-rpg-bg text-xs">►</span>}
                <Icon className={isActive ? "text-rpg-bg" : "text-neutral-500"} />
                <span className="hidden sm:block">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Panel */}
      <div className="rpg-panel mx-auto w-full p-6 shadow-xl">
        {/* Panel chrome */}
        <div className="flex items-center gap-2 mb-4 border-b border-gold-400/20 pb-3">
          <span className="w-2 h-2 bg-gold-400 inline-block" />
          <span className="pixel-font text-[8px] text-gold-400/70 tracking-widest">
            {tabs.find(t => t.id === active)?.label}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
