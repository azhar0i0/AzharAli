import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSettingsStore } from "@/lib/desktop/store";
import { EASE_SPRING } from "@/lib/motion";
import { loadProjects } from "@/lib/projects";

// What actually happens while the desktop gets ready, in plain words.
const STEPS = ["Loading workspace", "Fetching projects", "Opening desktop"];
const STEP_MS = 520;

/**
 * First-visit loading screen. Sits on the same wallpaper as the desktop so it
 * hands off without a jarring cut, then fades away.
 */
export function BootScreen() {
  const setBooted = useSettingsStore((s) => s.setBooted);
  const booted = useSettingsStore((s) => s.booted);
  const [visible, setVisible] = useState(!booted);
  const [step, setStep] = useState(0);

  // Runs on every visit (even when the boot screen is skipped) so the
  // Projects window opens with fresh data from localStorage.
  useEffect(() => {
    loadProjects().catch(() => {});
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i), i * STEP_MS));
    timers.push(
      setTimeout(() => {
        setBooted(true);
        setVisible(false);
      }, STEPS.length * STEP_MS + 250),
    );
    return () => timers.forEach(clearTimeout);
  }, [visible, setBooted]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE_SPRING }}
          className="desktop-wallpaper fixed inset-0 z-(--z-boot) grid place-items-center px-6"
        >
          <div aria-hidden className="pixel-grid pointer-events-none absolute inset-0" />
          <div aria-hidden className="grain pointer-events-none absolute inset-0" />

          {/* Static on purpose: this is server-rendered, so it must be visible
              before JavaScript loads (no opacity-0 entrance). */}
          <div className="relative w-full max-w-xs text-center">
            <h1 className="font-display text-5xl leading-none tracking-tight text-olive-dark">
              Azhar Ali
            </h1>
            <p className="mt-2 text-sm text-ink-soft">Full-stack developer</p>

            <div className="mx-auto mt-8 h-0.5 w-40 overflow-hidden rounded-full bg-paper-line">
              <motion.div
                className="h-full w-full origin-left rounded-full bg-orange"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: (STEPS.length * STEP_MS) / 1000, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>

            <div className="relative mt-3 h-5 overflow-hidden text-xs text-ink-soft">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: EASE_SPRING }}
                >
                  {STEPS[step]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
