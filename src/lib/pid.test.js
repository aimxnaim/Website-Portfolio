import { describe, it, expect } from "vitest"
import { pidFor } from "./pid"

describe("pidFor", () => {
    it("zero-pads to four characters", () => {
        expect(pidFor(0)).toBe("0142")
    })

    it("advances by a fixed stride", () => {
        expect(pidFor(1)).toBe("0279")
        expect(pidFor(2)).toBe("0416")
    })

    it("never collides across distinct seeds", () => {
        const seen = new Set()
        for (let i = 0; i < 50; i++) seen.add(pidFor(i))
        expect(seen.size).toBe(50)
    })

    it("is stable across calls", () => {
        expect(pidFor(7)).toBe(pidFor(7))
    })
})
