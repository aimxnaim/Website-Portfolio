import { motion } from "framer-motion"
import { ABOUT_TEXT } from "../constants"
import Experiences from "./Experiences"

const CareerSection = () => {
    return (
        <div className="pb-4">
            {/* About me intro */}
            <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto mt-6"
            >
                <div className="dialog-box">
                    <p className="pixel-font text-[7px] text-gold-400/60 tracking-widest mb-3">► ABOUT ME</p>
                    <p className="rpg-font text-xl text-neutral-300 leading-relaxed">{ABOUT_TEXT}</p>
                </div>
            </motion.div>

            {/* Quest log / career timeline */}
            <Experiences />
        </div>
    )
}

export default CareerSection
