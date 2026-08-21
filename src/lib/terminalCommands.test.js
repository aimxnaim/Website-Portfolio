import { describe, it, expect } from "vitest"
import { parseCommand, COMMANDS } from "./terminalCommands"
import { TAB_IDS } from "./tabs"

describe("parseCommand", () => {
    it.each(TAB_IDS)("maps %s to a tab", (id) => {
        expect(parseCommand(id)).toEqual({ type: "tab", payload: id })
    })

    it("is case-insensitive and trims whitespace", () => {
        expect(parseCommand("  PROJECTS  ")).toEqual({ type: "tab", payload: "projects" })
    })

    it("recognises help", () => {
        expect(parseCommand("help")).toEqual({ type: "help", payload: null })
    })

    it("recognises clear", () => {
        expect(parseCommand("clear")).toEqual({ type: "clear", payload: null })
    })

    it("recognises resume", () => {
        expect(parseCommand("resume")).toEqual({ type: "resume", payload: null })
    })

    it("reports unknown commands with the original input", () => {
        expect(parseCommand("sudo rm -rf /")).toEqual({ type: "unknown", payload: "sudo rm -rf /" })
    })

    it("preserves original casing (trimmed) on the unknown branch", () => {
        expect(parseCommand("  BaNaNa  ")).toEqual({ type: "unknown", payload: "BaNaNa" })
    })

    it("treats empty input as unknown", () => {
        expect(parseCommand("   ")).toEqual({ type: "unknown", payload: "" })
    })
})

describe("COMMANDS", () => {
    it("covers every tab plus resume, clear and help", () => {
        expect(COMMANDS.length).toBe(TAB_IDS.length + 3)
    })

    it.each(COMMANDS)("$name is a recognised command", ({ name }) => {
        expect(parseCommand(name).type).not.toBe("unknown")
    })
})
