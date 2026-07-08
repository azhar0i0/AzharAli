import { useEffect, useState } from "react";
import { useIconStore, useSettingsStore, useWindowStore } from "@/lib/desktop/store";
import { DesktopIcon } from "./DesktopIcon";
import { Window } from "./Window";
import { Taskbar } from "./Taskbar";
import { BootScreen } from "./BootScreen";
import { ContextMenu } from "./ContextMenu";
import { CommandPalette } from "./CommandPalette";
import { APP_META } from "@/lib/desktop/apps";

export function Desktop() {
  const { icons } = useIconStore();
  const windows = useWindowStore((s) => s.windows);
  const { cycleNext, close, activeId, minimize, open } = useWindowStore();
  const { theme, wallpaper } = useSettingsStore();
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  // Apply theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "Escape" && activeId) {
        close(activeId);
      } else if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        cycleNext();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m" && activeId) {
        e.preventDefault();
        minimize(activeId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, close, cycleNext, minimize]);

  const bg = (() => {
    switch (wallpaper) {
      case "olive":
        return "bg-olive";
      case "night":
        return "bg-[#141613]";
      case "orange":
        return "bg-gradient-to-br from-orange to-orange-soft";
      default:
        return "paper-grid";
    }
  })();

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden ${bg}`}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY });
      }}
      onClick={() => setMenu(null)}
    >
      {/* Paper vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.08))]" />

      {/* Icons layer */}
      <div className="absolute inset-0 pb-14">
        {icons.map((i) => (
          <DesktopIcon
            key={i.appId}
            appId={i.appId}
            label={APP_META[i.appId].label}
            col={i.x}
            row={i.y}
          />
        ))}
      </div>

      {/* Wallpaper double-click cycles theme (easter egg) */}
      <div
        className="absolute inset-0 -z-0"
        onDoubleClick={() => {
          setTapCount((c) => c + 1);
          useSettingsStore.getState().setTheme(theme === "dark" ? "light" : "dark");
        }}
      />

      {/* Windows */}
      {windows.map((w) => (
        <Window key={w.id} w={w} />
      ))}

      {/* Bottom-center welcome hint (only if no windows) */}
      {windows.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-20 mx-auto w-fit rounded-full border border-olive-dark/40 bg-card/70 px-3 py-1 font-mono text-[11px] text-ink-soft backdrop-blur">
          double-click a folder · right-click desktop · ⌘/Ctrl + K to search
        </div>
      )}

      {menu && <ContextMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} />}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <Taskbar />
      <BootScreen />

      {/* Open Home once after boot */}
      <BootFinished />
      <span className="sr-only">Konami taps: {tapCount}</span>
    </div>
  );
}

function BootFinished() {
  const booted = useSettingsStore((s) => s.booted);
  const openedRef = useOpenedOnce();
  const openApp = useWindowStore((s) => s.open);
  useEffect(() => {
    if (booted && !openedRef.current) {
      openedRef.current = true;
      openApp("home");
    }
  }, [booted, openApp, openedRef]);
  return null;
}

function useOpenedOnce() {
  const [ref] = useState({ current: false });
  return ref;
}
