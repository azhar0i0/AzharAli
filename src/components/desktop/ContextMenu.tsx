import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  TASKBAR_HEIGHT,
  THEMES,
  useIconStore,
  useSettingsStore,
  useWindowStore,
} from "@/lib/desktop/store";
import { FaChevronRight } from "react-icons/fa";

const EDGE_PAD = 8;

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
  const { setTheme, theme } = useSettingsStore();
  const resetIcons = useIconStore((s) => s.reset);
  const openApp = useWindowStore((s) => s.open);
  const closeAll = useWindowStore((s) => s.closeAll);
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [pos, setPos] = useState({ x, y });

  // Keep the whole menu on screen and above the taskbar, measuring its real size.
  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const maxX = window.innerWidth - w - EDGE_PAD;
    const maxY = window.innerHeight - TASKBAR_HEIGHT - h - EDGE_PAD;
    setPos({
      x: Math.max(EDGE_PAD, Math.min(x, maxX)),
      y: Math.max(EDGE_PAD, Math.min(y, maxY)),
    });
  }, [x, y]);

  const items: Item[] = [
    { kind: "action", label: "Refresh Desktop", run: () => window.location.reload(), shortcut: "F5" },
    { kind: "sep" },
    { kind: "action", label: "Open Terminal", run: () => openApp("terminal") },
    { kind: "action", label: "Open Home", run: () => openApp("home") },
    { kind: "action", label: "Open Projects", run: () => openApp("projects") },
    { kind: "sep" },
    {
      kind: "submenu",
      label: "Change Theme",
      children: THEMES.map((t) => ({
        kind: "action" as const,
        label: `${t.label}${t.id === theme ? "  ✓" : ""}`,
        run: () => setTheme(t.id),
      })),
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
            e.stopPropagation();
            onClose();
          }}
        />
        <motion.ul
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.12 }}
          style={{ left: pos.x, top: pos.y }}
          className="fixed z-[9998] w-60 rounded-md border border-olive-dark/60 bg-card py-1 text-sm window-shadow"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
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
                    <Submenu>
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
                    </Submenu>
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

/**
 * A submenu that opens beside its parent item and keeps itself on screen:
 * it flips to the left when there isn't room on the right and shifts up so it
 * never runs under the taskbar.
 */
function Submenu({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    left: "100%",
    top: 0,
    visibility: "hidden",
  });

  useLayoutEffect(() => {
    const el = ref.current;
    const li = el?.parentElement;
    if (!el || !li) return;
    const liRect = li.getBoundingClientRect();
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const gap = 4;

    // Horizontal: open to the right, flip left if it would overflow.
    let left = liRect.width + gap;
    if (liRect.right + gap + w > window.innerWidth - EDGE_PAD) {
      left = -w - gap;
    }

    // Vertical: align to the item, shift up if it would pass below the taskbar.
    let top = 0;
    const bottomLimit = window.innerHeight - TASKBAR_HEIGHT - EDGE_PAD;
    if (liRect.top + h > bottomLimit) {
      top = bottomLimit - (liRect.top + h);
      if (liRect.top + top < EDGE_PAD) top = EDGE_PAD - liRect.top;
    }

    setStyle({ position: "absolute", left, top, visibility: "visible" });
  }, []);

  return (
    <ul
      ref={ref}
      style={style}
      className="w-48 rounded-md border border-olive-dark/60 bg-card py-1 window-shadow"
    >
      {children}
    </ul>
  );
}
