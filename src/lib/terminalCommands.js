const TABS = ["career", "education", "projects", "stack"]

export const COMMANDS = [
    ...TABS.map((t) => ({ name: t, description: `open the ${t} panel` })),
    { name: "resume", description: "download resume PDF" },
    { name: "clear",  description: "clear the terminal" },
    { name: "help",   description: "list available commands" },
]

export const parseCommand = (input) => {
    const cmd = String(input ?? "").trim().toLowerCase()

    if (TABS.includes(cmd)) return { type: "tab", payload: cmd }
    if (cmd === "help")     return { type: "help", payload: null }
    if (cmd === "clear")    return { type: "clear", payload: null }
    if (cmd === "resume")   return { type: "resume", payload: null }

    return { type: "unknown", payload: String(input ?? "").trim() }
}
