import { describe, it, expect } from "vitest"
import { formatClock, liveAge } from "./clock"

describe("formatClock", () => {
    it("zero-pads every field", () => {
        expect(formatClock(new Date(2026, 0, 1, 3, 7, 9))).toBe("03:07:09")
    })

    it("uses 24-hour time", () => {
        expect(formatClock(new Date(2026, 0, 1, 23, 59, 59))).toBe("23:59:59")
    })
})

describe("liveAge", () => {
    // Birth: December 2001.
    it("counts the birthday as passed during December", () => {
        expect(liveAge(new Date(2026, 11, 5))).toBe(25)
    })

    it("has not counted the birthday in November", () => {
        expect(liveAge(new Date(2026, 10, 5))).toBe(24)
    })
})
