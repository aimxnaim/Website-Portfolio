const PID_BASE = 142
const PID_STRIDE = 137

/**
 * Derives a decorative process ID from a seed index.
 *
 * The reference mockup hardcoded these (0142, 0288, 0417...), which meant
 * hand-picking a number every time an entry was added to constants/index.js.
 * PIDs are decorative — they need to look plausible and stay stable across
 * renders, not match the mockup exactly.
 *
 * Career rows seed from their own index; project rows seed from
 * EXPERIENCES.length + index, so the two lists never collide.
 */
export const pidFor = (seedIndex) =>
    String(PID_BASE + seedIndex * PID_STRIDE).padStart(4, "0")
