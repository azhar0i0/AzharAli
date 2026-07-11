import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============ Types ============
export type AppId =
  | "home"
  | "about"
  | "projects"
  | "skills"
  | "services"
  | "contact"
  | "resume"
  | "terminal"
  | "settings";

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; width: number; height: number };
}

/** Taskbar height in px (matches the `h-12` bar). The window work area and the
 *  desktop context menu both stay above this line, like a real OS. */
export const TASKBAR_HEIGHT = 48;

interface WindowStore {
  windows: WindowState[];
  activeId: string | null;
  zCounter: number;
  open: (appId: AppId, opts?: { title?: string; width?: number; height?: number }) => void;
  close: (id: string) => void;
  closeAll: () => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMinimize: (id: string) => void;
  maximize: (id: string) => void;
  updateBounds: (id: string, b: Partial<Pick<WindowState, "x" | "y" | "width" | "height">>) => void;
  cycleNext: () => void;
}

const APP_TITLES: Record<AppId, string> = {
  home: "C:\\AzharAli\\Home",
  about: "C:\\AzharAli\\About.txt",
  projects: "C:\\AzharAli\\Projects",
  skills: "C:\\AzharAli\\Skills.exe",
  services: "C:\\AzharAli\\Services",
  contact: "C:\\AzharAli\\Contact.vcf",
  resume: "C:\\AzharAli\\Resume.pdf",
  terminal: "C:\\AzharAli\\Terminal",
  settings: "C:\\AzharAli\\Settings",
};

const APP_DEFAULT_SIZE: Record<AppId, { w: number; h: number }> = {
  home: { w: 720, h: 520 },
  about: { w: 680, h: 560 },
  projects: { w: 900, h: 620 },
  skills: { w: 760, h: 580 },
  services: { w: 720, h: 540 },
  contact: { w: 640, h: 560 },
  resume: { w: 720, h: 640 },
  terminal: { w: 640, h: 420 },
  settings: { w: 620, h: 560 },
};

function nextCascadePosition(existing: WindowState[], w: number, h: number) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const startX = 120;
  const startY = 60;
  const step = 30;
  for (let col = 0; col < 4; col++) {
    for (let i = 0; i < 12; i++) {
      const x = startX + col * 60 + i * step;
      const y = startY + i * step;
      if (x + w > vw - 40 || y + h > vh - 80) continue;
      const clash = existing.some((win) => !win.minimized && win.x === x && win.y === y);
      if (!clash) return { x, y };
    }
  }
  return { x: startX, y: startY };
}

export const useWindowStore = create<WindowStore>()((set, get) => ({
  windows: [],
  activeId: null,
  zCounter: 10,
  open: (appId, opts) => {
    const existing = get().windows.find((w) => w.appId === appId);
    if (existing) {
      get().focus(existing.id);
      if (existing.minimized) {
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === existing.id ? { ...w, minimized: false } : w,
          ),
        }));
      }
      return;
    }
    const size = APP_DEFAULT_SIZE[appId];
    const width = opts?.width ?? size.w;
    const height = opts?.height ?? size.h;
    const pos = nextCascadePosition(get().windows, width, height);
    const z = get().zCounter + 1;
    const id = `${appId}-${Date.now()}`;
    set((s) => ({
      zCounter: z,
      activeId: id,
      windows: [
        ...s.windows,
        {
          id,
          appId,
          title: opts?.title ?? APP_TITLES[appId],
          x: pos.x,
          y: pos.y,
          width,
          height,
          zIndex: z,
          minimized: false,
          maximized: false,
        },
      ],
    }));
  },
  close: (id) =>
    set((s) => ({
      windows: s.windows.filter((w) => w.id !== id),
      activeId: s.activeId === id ? null : s.activeId,
    })),
  closeAll: () => set({ windows: [], activeId: null }),
  focus: (id) => {
    const z = get().zCounter + 1;
    set((s) => ({
      zCounter: z,
      activeId: id,
      windows: s.windows.map((w) => (w.id === id ? { ...w, zIndex: z, minimized: false } : w)),
    }));
  },
  minimize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
      activeId: s.activeId === id ? null : s.activeId,
    })),
  toggleMinimize: (id) => {
    const w = get().windows.find((x) => x.id === id);
    if (!w) return;
    if (w.minimized || get().activeId !== id) get().focus(id);
    else get().minimize(id);
  },
  maximize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized && w.prev) {
          return { ...w, maximized: false, ...w.prev, prev: undefined };
        }
        const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
        const vh = typeof window !== "undefined" ? window.innerHeight : 800;
        return {
          ...w,
          maximized: true,
          prev: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: 0,
          width: vw,
          // Fill the work area, stopping just above the taskbar.
          height: vh - TASKBAR_HEIGHT,
        };
      }),
    })),
  updateBounds: (id, b) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, ...b } : w)),
    })),
  cycleNext: () => {
    const wins = get().windows.filter((w) => !w.minimized);
    if (wins.length === 0) return;
    const idx = wins.findIndex((w) => w.id === get().activeId);
    const next = wins[(idx + 1) % wins.length];
    get().focus(next.id);
  },
}));

// ============ Icons store ============
export interface DesktopIcon {
  appId: AppId;
  label: string;
  x: number;
  y: number;
}

interface IconStore {
  icons: DesktopIcon[];
  move: (appId: AppId, x: number, y: number) => void;
  reset: () => void;
}

const DEFAULT_ICONS: DesktopIcon[] = [
  { appId: "home", label: "Home", x: 0, y: 0 },
  { appId: "about", label: "About.txt", x: 0, y: 1 },
  { appId: "projects", label: "Projects", x: 0, y: 2 },
  { appId: "skills", label: "Skills.exe", x: 0, y: 3 },
  { appId: "services", label: "Services", x: 0, y: 4 },
  { appId: "resume", label: "Resume.pdf", x: 1, y: 0 },
  { appId: "contact", label: "Contact.vcf", x: 1, y: 1 },
  { appId: "terminal", label: "Terminal", x: 1, y: 2 },
  { appId: "settings", label: "Settings", x: 1, y: 3 },
];

export const useIconStore = create<IconStore>()(
  persist(
    (set, get) => ({
      icons: DEFAULT_ICONS,
      move: (appId, x, y) => {
        const icons = get().icons.slice();
        const src = icons.find((i) => i.appId === appId);
        if (!src) return;
        const occupant = icons.find((i) => i.appId !== appId && i.x === x && i.y === y);
        if (occupant) {
          occupant.x = src.x;
          occupant.y = src.y;
        }
        src.x = x;
        src.y = y;
        set({ icons: [...icons] });
      },
      reset: () => set({ icons: DEFAULT_ICONS }),
    }),
    { name: "azharos-icons-v2" },
  ),
);

// ============ Settings store ============
export type CursorStyle = "default" | "retro" | "dot" | "off";
export type IconSize = "sm" | "md" | "lg";
export type AnimSpeed = "off" | "slow" | "normal" | "fast";

/**
 * A Theme is a complete, self-consistent look: it drives the wallpaper, the
 * window/desktop text colors, the taskbar chrome and a baked-in accent all at
 * once. `mode` decides whether the `.dark` class is applied so that light or
 * dark surfaces (and Tailwind `dark:` variants) stay readable no matter which
 * theme is picked — that's what keeps text visible on dark wallpapers.
 */
export type ThemeId = "paper" | "olive" | "sunset" | "slate" | "midnight" | "ocean";

export interface ThemeDef {
  id: ThemeId;
  label: string;
  mode: "light" | "dark";
  /** Baked-in accent for this theme (hex). */
  accent: string;
}

export const THEMES: ThemeDef[] = [
  { id: "paper", label: "Paper", mode: "light", accent: "#f08a24" },
  { id: "olive", label: "Olive", mode: "light", accent: "#c2683c" },
  { id: "sunset", label: "Sunset", mode: "light", accent: "#d94f6a" },
  { id: "slate", label: "Slate", mode: "dark", accent: "#7aa2d6" },
  { id: "midnight", label: "Midnight", mode: "dark", accent: "#4bb6d9" },
  { id: "ocean", label: "Ocean", mode: "dark", accent: "#e9b44c" },
];

export const THEME_MAP: Record<ThemeId, ThemeDef> = THEMES.reduce(
  (acc, t) => ((acc[t.id] = t), acc),
  {} as Record<ThemeId, ThemeDef>,
);

export function getTheme(id: ThemeId): ThemeDef {
  return THEME_MAP[id] ?? THEME_MAP.paper;
}

interface SettingsStore {
  theme: ThemeId;
  booted: boolean;
  soundsMuted: boolean;
  iconSize: IconSize;
  cursorStyle: CursorStyle;
  animSpeed: AnimSpeed;
  parallax: boolean;
  setTheme: (t: ThemeId) => void;
  setBooted: (b: boolean) => void;
  toggleSounds: () => void;
  setIconSize: (s: IconSize) => void;
  setCursorStyle: (c: CursorStyle) => void;
  setAnimSpeed: (a: AnimSpeed) => void;
  toggleParallax: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: "paper",
      booted: false,
      soundsMuted: true,
      iconSize: "md",
      cursorStyle: "default",
      animSpeed: "normal",
      parallax: true,
      setTheme: (theme) => set({ theme }),
      setBooted: (booted) => set({ booted }),
      toggleSounds: () => set((s) => ({ soundsMuted: !s.soundsMuted })),
      setIconSize: (iconSize) => set({ iconSize }),
      setCursorStyle: (cursorStyle) => set({ cursorStyle }),
      setAnimSpeed: (animSpeed) => set({ animSpeed }),
      toggleParallax: () => set((s) => ({ parallax: !s.parallax })),
    }),
    { name: "azharos-settings-v3" },
  ),
);
