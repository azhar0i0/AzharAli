import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowStore, type AppId } from "@/lib/desktop/store";
import { APP_META } from "@/lib/desktop/apps";
import { AppIcon } from "./AppIcon";

const ALL_APPS: AppId[] = ["home", "about", "projects", "skills", "services", "resume", "contact", "terminal", "settings"];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const openApp = useWindowStore((s) => s.open);

  const results = useMemo(
    () =>
      ALL_APPS.filter((a) =>
        (APP_META[a].label + " " + APP_META[a].hint).toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  useEffect(() => setI(0), [q]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setI((v) => Math.min(v + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setI((v) => Math.max(v - 1, 0)); }
    else if (e.key === "Enter") { const pick = results[i]; if (pick) { openApp(pick); onClose(); setQ(""); } }
    else if (e.key === "Escape") onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/40 p-4 pt-32 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-xl border border-olive-dark/60 bg-card window-shadow"
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKey}
              placeholder="Search apps, projects, actions… (Ctrl/⌘+K)"
              className="w-full border-b border-paper-line bg-transparent px-4 py-3 text-sm outline-none"
            />
            <ul className="max-h-72 overflow-y-auto scrollbar-thin">
              {results.map((a, idx) => (
                <li key={a}>
                  <button
                    onClick={() => { openApp(a); onClose(); setQ(""); }}
                    onMouseEnter={() => setI(idx)}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm ${idx === i ? "bg-orange/15" : "hover:bg-secondary"}`}
                  >
                    <AppIcon appId={a} size={20} />
                    <div>
                      <div className="font-medium">{APP_META[a].label}</div>
                      <div className="text-[11px] text-ink-soft">{APP_META[a].hint}</div>
                    </div>
                    <span className="ml-auto rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-ink-soft">↵</span>
                  </button>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-ink-soft">No matches</li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
