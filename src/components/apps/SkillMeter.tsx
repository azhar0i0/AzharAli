import { motion } from "framer-motion";

const CELLS = 10;

/** Segmented, pixel-style proficiency meter — fills cell by cell instead of a smooth bar. */
export function SkillMeter({
  level,
  delay = 0,
  inView = false,
}: {
  level: number;
  delay?: number;
  /** Animate when scrolled into view instead of on mount. */
  inView?: boolean;
}) {
  const filled = Math.round((level / 100) * CELLS);
  return (
    <div className="mt-1.5 flex gap-[3px]" role="meter" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100}>
      {Array.from({ length: CELLS }, (_, i) => {
        const on = i < filled;
        const target = { opacity: 1, scaleY: 1 };
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, scaleY: 0.4 }}
            {...(inView
              ? { whileInView: target, viewport: { once: true } }
              : { animate: target })}
            transition={{ delay: delay + i * 0.03, duration: 0.2 }}
            className={`h-2 flex-1 rounded-[1px] ${on ? "bg-orange" : "bg-paper-line/70"}`}
          />
        );
      })}
    </div>
  );
}

/** Small "available" indicator in the desaturated online green. */
export function StatusDot({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`inline-block h-2 w-2 rounded-full bg-online ${className}`} />;
}
