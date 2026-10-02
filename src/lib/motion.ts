/** Shared motion language: one spring-like curve and a quiet fade-up reveal. */
export const EASE_SPRING = [0.32, 0.72, 0, 1] as const;

/**
 * Spread onto any motion element for a short, quiet fade-up once it scrolls
 * into view, e.g. `<motion.li {...reveal(i * 0.04)} />`.
 */
export function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    // No negative margin: items at the very end of a scroll area (above a
    // taskbar or tab bar) must still count as visible, or they stay faded.
    viewport: { once: true },
    transition: { duration: 0.45, ease: EASE_SPRING, delay },
  };
}
