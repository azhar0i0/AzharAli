import { useEffect, useRef, useState } from "react";
import { useIconStore, useSettingsStore, useWindowStore } from "@/lib/desktop/store";
import { DesktopIcon } from "./DesktopIcon";
import { Window } from "./Window";
import { Taskbar } from "./Taskbar";
import { BootScreen } from "./BootScreen";
import { ContextMenu } from "./ContextMenu";
import { CommandPalette } from "./CommandPalette";
import { APP_META } from "@/lib/desktop/apps";

const WALL_CLASS: Record<string, string> = {
  paper: "wall-paper",
  olive: "wall-olive",
  night: "wall-night",
  sunset: "wall-sunset",
  ocean: "wall-ocean",
  graphite: "wall-graphite",
};

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function Desktop() {
  const { icons } = useIconStore();
  const windows = useWindowStore((s) => s.windows);
  const { cycleNext, close, activeId, minimize } = useWindowStore();
  const { theme, wallpaper, accent, cursorStyle, animSpeed, parallax } = useSettingsStore();
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hoverTarget, setHoverTarget] = useState<"idle" | "interactive">("idle");

  // Theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Accent
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--ring", accent);
    root.style.setProperty("--orange", accent);
    root.style.setProperty("--accent-rgb", hexToRgb(accent));
  }, [accent]);

  // Animation speed
  useEffect(() => {
    const map = { off: "0", slow: "1.6", normal: "1", fast: "0.55" };
    document.documentElement.style.setProperty("--anim-scale", map[animSpeed]);
  }, [animSpeed]);

  // Cursor class
  useEffect(() => {
    const b = document.body;
    b.classList.remove("cursor-retro", "cursor-dot", "cursor-off");
    if (cursorStyle !== "default") b.classList.add(`cursor-${cursorStyle}`);
  }, [cursorStyle]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (menu) setMenu(null);
        else if (activeId) close(activeId);
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
  }, [activeId, close, cycleNext, minimize, paletteOpen, menu]);

  // Parallax + custom cursor tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (parallax && parallaxRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        parallaxRef.current.style.transform = `translate3d(${-x}px, ${-y}px, 0) scale(1.03)`;
      }
      if (cursorStyle !== "default" && cursorStyle !== "off" && cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      // Detect interactive hover for cursor state
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest(
        "button,a,[role=button],input,textarea,select,.window-drag-handle",
      );
      setHoverTarget(interactive ? "interactive" : "idle");
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [parallax, cursorStyle]);

  const wallClass = WALL_CLASS[wallpaper] ?? "wall-paper";

  return (
    <div
      className="relative h-dvh w-screen overflow-hidden"
      onContextMenu={(e) => {
        e.preventDefault();
        const pad = 12;
        const x = Math.min(e.clientX, window.innerWidth - 240 - pad);
        const y = Math.min(e.clientY, window.innerHeight - 340 - pad);
        setMenu({ x, y });
      }}
      onClick={() => setMenu(null)}
    >
      {/* Parallax wallpaper layer */}
      <div
        ref={parallaxRef}
        className={`absolute inset-[-20px] transition-transform duration-[400ms] ease-out ${wallClass}`}
        style={{ willChange: "transform" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.18))]" />

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

      {/* Windows */}
      {windows.map((w) => (
        <Window key={w.id} w={w} />
      ))}

      {/* Hint */}
      {windows.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-20 mx-auto w-fit rounded-full border border-olive-dark/40 bg-card/70 px-3 py-1 font-mono text-[11px] text-ink-soft backdrop-blur">
          double-click a folder · right-click desktop · Ctrl + K to search
        </div>
      )}

      {menu && <ContextMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} />}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <Taskbar />
      <BootScreen />
      <BootFinished />

      {/* Custom cursor (pointer devices only) */}
      {cursorStyle !== "default" && cursorStyle !== "off" && (
        <div
          ref={cursorRef}
          aria-hidden
          className={`pointer-events-none fixed left-0 top-0 z-[10000] -translate-x-1/2 -translate-y-1/2 ${
            cursorStyle === "retro" ? "cursor-glyph-retro" : "cursor-glyph-dot"
          } ${hoverTarget === "interactive" ? "is-hover" : ""}`}
        />
      )}
    </div>
  );
}

function BootFinished() {
  const booted = useSettingsStore((s) => s.booted);
  const opened = useRef(false);
  const openApp = useWindowStore((s) => s.open);
  useEffect(() => {
    if (booted && !opened.current) {
      opened.current = true;
      openApp("home");
    }
  }, [booted, openApp]);
  return null;
}
