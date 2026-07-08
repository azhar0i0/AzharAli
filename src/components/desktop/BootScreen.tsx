import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSettingsStore } from "@/lib/desktop/store";

const LINES = [
  "AzharOS BIOS v1.0",
  "Detecting devices... OK",
  "Loading kernel modules...",
  "Mounting /home/azhar",
  "Starting window manager...",
  "Connecting to GitHub...",
  "Loading portfolio...",
  "Welcome, Azhar.",
];

export function BootScreen() {
  const setBooted = useSettingsStore((s) => s.setBooted);
  const booted = useSettingsStore((s) => s.booted);
  const [visible, setVisible] = useState(!booted);
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const int = setInterval(() => {
      i++;
      setIdx((v) => Math.min(v + 1, LINES.length));
      setProgress(Math.min(100, Math.round((i / LINES.length) * 100)));
      if (i >= LINES.length) {
        clearInterval(int);
        setTimeout(() => {
          setBooted(true);
          setVisible(false);
        }, 600);
      }
    }, 260);
    return () => clearInterval(int);
  }, [visible, setBooted]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black text-emerald-300"
        >
          <div className="w-[520px] max-w-[90vw] font-mono text-sm">
            <div className="mb-4 flex items-center gap-3 text-orange">
              <span className="grid h-8 w-8 place-items-center rounded-sm bg-orange font-bold text-black">A</span>
              <div>
                <div className="text-xl leading-tight">AzharOS</div>
                <div className="text-[11px] text-emerald-500">v1.0 — 2026</div>
              </div>
            </div>
            <div className="min-h-[220px] space-y-1">
              {LINES.slice(0, idx).map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between"
                >
                  <span>&gt; {l}</span>
                  <span className="text-emerald-500">[ OK ]</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-sm border border-emerald-800 bg-emerald-950">
              <motion.div
                className="h-full bg-orange"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <div className="mt-1 text-right text-[11px] text-emerald-500">{progress}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
