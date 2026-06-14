import { motion } from "framer-motion"

const Footer = () => {
    return (
        <footer className="border-t-2 border-gold-400/20 mt-10">
            <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="w-full max-w-screen-xl mx-auto py-10 flex flex-col items-center gap-5"
            >
                {/* THE END */}
                <div className="flex items-center gap-4">
                    <div className="h-px w-16 bg-gold-400/30" />
                    <span className="rpg-font text-4xl text-gold-400 tracking-widest">― THE END ―</span>
                    <div className="h-px w-16 bg-gold-400/30" />
                </div>

                {/* Credits box */}
                <div className="rpg-panel-dim p-6 text-center max-w-sm w-full">
                    <p className="pixel-font text-[8px] text-gold-400/60 tracking-widest mb-4">GAME CREDITS</p>
                    <p className="rpg-font text-2xl text-neutral-300">DEVELOPED &amp; DESIGNED BY</p>
                    <p className="rpg-font text-3xl text-gold-400 mt-1">AIMAN NAIM</p>
                    <div className="h-px w-full bg-gold-400/20 my-4" />
                    <p className="rpg-font text-lg text-neutral-500">BUILT WITH REACT · VITE · TAILWIND</p>
                    <p className="rpg-font text-lg text-neutral-500">FRAMER MOTION · VERCEL</p>
                </div>

                {/* Copyright */}
                <p className="pixel-font text-[7px] text-neutral-700 tracking-widest">
                    © 2024 AIMAN NAIM · ALL RIGHTS RESERVED
                </p>

                {/* Blink prompt */}
                <p className="pixel-font text-[7px] text-gold-400/30">
                    <span className="blink">▲ PRESS START TO PLAY AGAIN ▲</span>
                </p>
            </motion.div>
        </footer>
    )
}

export default Footer
