import { AnimatePresence, motion } from "framer-motion";
import { useSettingsStore } from "@/lib/desktop/store";
import { useIconStore } from "@/lib/desktop/store";
import { useWindowStore } from "@/lib/desktop/store";

export function ContextMenu({
  x,
  y,
  onClose,
}: {
  x: number;
  y: number;
  onClose: () => void;
}) {
  const { setTheme, setWallpaper, theme } = useSettingsStore();
  const resetIcons = useIconStore((s) => s.reset);
  const openApp = useWindowStore((s) => s.open);

  const items: { label: string; run: () => void; danger?: boolean }[] = [
    { label: "Refresh Desktop", run: () => window.location.reload() },
    { label: "Open Terminal", run: () => openApp("terminal") },
    { label: "Open Settings", run: () => openApp("settings") },
    { label: theme === "dark" ? "Light Theme" : "Dark Theme", run: () => setTheme(theme === "dark" ? "light" : "dark") },
    { label: "Wallpaper: Paper", run: () => setWallpaper("paper") },
    { label: "Wallpaper: Olive", run: () => setWallpaper("olive") },
    { label: "Reset icon layout", run: resetIcons, danger: true },
  ];

  return (
    <AnimatePresence>
      <>
        <div className="fixed inset-0 z-[9997]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
        <motion.ul
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          style={{ left: x, top: y }}
          className="absolute z-[9998] w-56 overflow-hidden rounded-md border border-olive-dark/60 bg-card py-1 text-sm window-shadow"
        >
          {items.map((it) => (
            <li key={it.label}>
              <button
                onClick={() => { it.run(); onClose(); }}
                className={`block w-full px-3 py-1.5 text-left hover:bg-secondary ${it.danger ? "text-destructive" : ""}`}
              >
                {it.label}
              </button>
            </li>
          ))}
        </motion.ul>
      </>
    </AnimatePresence>
  );
}
