import { TAB_IDS } from "./tabs"

export const COMMANDS = [
    ...TAB_IDS.map((t) => ({ name: t, description: `open the ${t} panel` })),
    { name: "resume", description: "download resume PDF" },
    { name: "clear",  description: "clear the terminal" },
    { name: "help",   description: "list available commands" },
]

export const parseCommand = (input) => {
    const cmd = String(input ?? "").trim().toLowerCase()

    if (TAB_IDS.includes(cmd)) return { type: "tab", payload: cmd }
    if (cmd === "help")     return { type: "help", payload: null }
    if (cmd === "clear")    return { type: "clear", payload: null }
    if (cmd === "resume")   return { type: "resume", payload: null }

    return { type: "unknown", payload: String(input ?? "").trim() }
}
