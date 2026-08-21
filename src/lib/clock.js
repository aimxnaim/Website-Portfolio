const BIRTH_YEAR = 2001
const BIRTH_MONTH = 12 // December, 1-indexed

const pad = (n) => String(n).padStart(2, "0")

export const formatClock = (date) =>
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

export const liveAge = (now = new Date()) =>
    now.getFullYear() - BIRTH_YEAR - (now.getMonth() + 1 < BIRTH_MONTH ? 1 : 0)
