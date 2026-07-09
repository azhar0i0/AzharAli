import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useIconStore,
  useSettingsStore,
  useWindowStore,
  type WallpaperKind,
} from "@/lib/desktop/store";
import { FaChevronRight } from "react-icons/fa";

const WALLPAPERS: { id: WallpaperKind; label: string }[] = [
  { id: "paper", label: "Paper Grid" },
  { id: "olive", label: "Olive Field" },
  { id: "night", label: "Midnight" },
  { id: "sunset", label: "Sunset" },
  { id: "ocean", label: "Ocean" },
  { id: "graphite", label: "Graphite" },
];

type Item =
  | { kind: "action"; label: string; run: () => void; danger?: boolean; shortcut?: string }
  | { kind: "sep" }
  | { kind: "submenu"; label: string; children: Item[] };

export function ContextMenu({
  x,
  y,
  onClose,
}: {
  x: number;
  y: number;
  onClose: () => void;
}) {
  const { setTheme, setWallpaper, theme, wallpaper } = useSettingsStore();
  const resetIcons = useIconStore((s) => s.reset);
  const openApp = useWindowStore((s) => s.open);
  const closeAll = useWindowStore((s) => s.closeAll);
  const [subOpen, setSubOpen] = useState<string | null>(null);

  const items: Item[] = [
    { kind: "action", label: "Refresh Desktop", run: () => window.location.reload(), shortcut: "F5" },
    { kind: "sep" },
    { kind: "action", label: "Open Terminal", run: () => openApp("terminal") },
    { kind: "action", label: "Open Home", run: () => openApp("home") },
    { kind: "action", label: "Open Projects", run: () => openApp("projects") },
    { kind: "sep" },
    {
      kind: "submenu",
      label: "Change Wallpaper",
      children: WALLPAPERS.map((w) => ({
        kind: "action" as const,
        label: `${w.label}${w.id === wallpaper ? "  ✓" : ""}`,
        run: () => setWallpaper(w.id),
      })),
    },
    {
      kind: "action",
      label: theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme",
      run: () => setTheme(theme === "dark" ? "light" : "dark"),
    },
    { kind: "action", label: "Open Settings", run: () => openApp("settings") },
    { kind: "sep" },
    { kind: "action", label: "Close All Windows", run: closeAll },
    { kind: "action", label: "Reset Icon Layout", run: resetIcons, danger: true },
  ];

  return (
    <AnimatePresence>
      <>
        <div
          className="fixed inset-0 z-[9997]"
          onClick={onClose}
          onContextMenu={(e) => {
            e.preventDefault();
            onClose();
          }}
        />
        <motion.ul
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.12 }}
          style={{ left: x, top: y }}
          className="absolute z-[9998] w-60 overflow-visible rounded-md border border-olive-dark/60 bg-card py-1 text-sm window-shadow"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((it, idx) => {
            if (it.kind === "sep") {
              return <li key={idx} className="my-1 h-px bg-paper-line" />;
            }
            if (it.kind === "submenu") {
              const isOpen = subOpen === it.label;
              return (
                <li
                  key={it.label}
                  className="relative"
                  onMouseEnter={() => setSubOpen(it.label)}
                  onMouseLeave={() => setSubOpen(null)}
                >
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between px-3 py-1.5 text-left hover:bg-secondary"
                  >
                    <span>{it.label}</span>
                    <FaChevronRight className="text-[10px] opacity-60" />
                  </button>
                  {isOpen && (
                    <ul className="absolute left-full top-0 ml-1 w-48 rounded-md border border-olive-dark/60 bg-card py-1 window-shadow">
                      {it.children.map((c) =>
                        c.kind === "action" ? (
                          <li key={c.label}>
                            <button
                              type="button"
                              onClick={() => {
                                c.run();
                                onClose();
                              }}
                              className="block w-full cursor-pointer px-3 py-1.5 text-left hover:bg-secondary"
                            >
                              {c.label}
                            </button>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  )}
                </li>
              );
            }
            return (
              <li key={it.label}>
                <button
                  type="button"
                  onClick={() => {
                    it.run();
                    onClose();
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between px-3 py-1.5 text-left hover:bg-secondary ${
                    it.danger ? "text-destructive" : ""
                  }`}
                >
                  <span>{it.label}</span>
                  {it.shortcut && <span className="font-mono text-[10px] opacity-60">{it.shortcut}</span>}
                </button>
              </li>
            );
          })}
        </motion.ul>
      </>
    </AnimatePresence>
  );
}
