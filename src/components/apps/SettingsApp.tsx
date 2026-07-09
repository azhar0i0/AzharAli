import {
  ACCENT_PRESETS,
  useIconStore,
  useSettingsStore,
  type AnimSpeed,
  type CursorStyle,
  type IconSize,
  type WallpaperKind,
} from "@/lib/desktop/store";
import {
  FaVolumeMute,
  FaVolumeUp,
  FaCheck,
} from "react-icons/fa";

const WALLPAPERS: { id: WallpaperKind; label: string; preview: string }[] = [
  { id: "paper", label: "Paper Grid", preview: "wall-paper" },
  { id: "olive", label: "Olive Field", preview: "wall-olive" },
  { id: "night", label: "Midnight", preview: "wall-night" },
  { id: "sunset", label: "Sunset", preview: "wall-sunset" },
  { id: "ocean", label: "Ocean", preview: "wall-ocean" },
  { id: "graphite", label: "Graphite", preview: "wall-graphite" },
];

export function SettingsApp() {
  const {
    theme, setTheme,
    wallpaper, setWallpaper,
    accent, setAccent,
    soundsMuted, toggleSounds,
    iconSize, setIconSize,
    cursorStyle, setCursorStyle,
    animSpeed, setAnimSpeed,
    parallax, toggleParallax,
  } = useSettingsStore();
  const resetIcons = useIconStore((s) => s.reset);

  return (
    <div className="h-full overflow-y-auto p-6 scrollbar-thin">
      <h1 className="text-2xl font-bold text-olive-dark">Settings</h1>
      <p className="text-sm text-ink-soft">Personalize your AzharOS experience.</p>

      <Group title="Theme">
        <div className="flex gap-2">
          {(["light", "dark"] as const).map((t) => (
            <Chip key={t} active={theme === t} onClick={() => setTheme(t)} label={t} />
          ))}
        </div>
      </Group>

      <Group title="Accent Color">
        <div className="flex flex-wrap gap-2">
          {ACCENT_PRESETS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAccent(a.color)}
              title={a.label}
              className={`relative h-9 w-9 cursor-pointer rounded-full border-2 transition ${
                accent.toLowerCase() === a.color.toLowerCase()
                  ? "border-ink scale-110"
                  : "border-paper-line hover:scale-105"
              }`}
              style={{ background: a.color }}
              aria-label={`Accent ${a.label}`}
            >
              {accent.toLowerCase() === a.color.toLowerCase() && (
                <FaCheck className="absolute inset-0 m-auto text-white drop-shadow" />
              )}
            </button>
          ))}
          <label className="ml-2 flex cursor-pointer items-center gap-2 rounded-md border border-paper-line bg-card px-2 py-1 text-xs">
            Custom
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="h-6 w-8 cursor-pointer border-0 bg-transparent p-0"
            />
          </label>
        </div>
      </Group>

      <Group title="Wallpaper">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {WALLPAPERS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWallpaper(w.id)}
              className={`cursor-pointer overflow-hidden rounded-md border transition ${
                wallpaper === w.id ? "border-orange ring-2 ring-orange/30" : "border-paper-line hover:border-olive-dark/60"
              }`}
            >
              <div className={`h-16 ${w.preview}`} />
              <div className="bg-card p-1.5 text-center text-xs">{w.label}</div>
            </button>
          ))}
        </div>
      </Group>

      <Group title="Icon Size">
        <div className="flex gap-2">
          {(["sm", "md", "lg"] as IconSize[]).map((s) => (
            <Chip key={s} active={iconSize === s} onClick={() => setIconSize(s)} label={s.toUpperCase()} />
          ))}
        </div>
      </Group>

      <Group title="Cursor">
        <div className="flex flex-wrap gap-2">
          {(["default", "retro", "dot", "off"] as CursorStyle[]).map((c) => (
            <Chip key={c} active={cursorStyle === c} onClick={() => setCursorStyle(c)} label={c} />
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-soft">Retro & dot render a custom on-screen cursor. Off hides the system cursor over the desktop.</p>
      </Group>

      <Group title="Animation Speed">
        <div className="flex flex-wrap gap-2">
          {(["off", "slow", "normal", "fast"] as AnimSpeed[]).map((a) => (
            <Chip key={a} active={animSpeed === a} onClick={() => setAnimSpeed(a)} label={a} />
          ))}
        </div>
      </Group>

      <Group title="Wallpaper Parallax">
        <button
          type="button"
          onClick={toggleParallax}
          className="cursor-pointer rounded-md border border-paper-line bg-card px-3 py-1.5 text-sm"
        >
          {parallax ? "On" : "Off"}
        </button>
      </Group>

      <Group title="Sounds">
        <button
          type="button"
          onClick={toggleSounds}
          className="flex cursor-pointer items-center gap-2 rounded-md border border-paper-line bg-card px-3 py-1.5 text-sm"
        >
          {soundsMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          {soundsMuted ? "Muted" : "On"}
        </button>
      </Group>

      <Group title="Desktop">
        <button
          type="button"
          onClick={resetIcons}
          className="cursor-pointer rounded-md border border-paper-line bg-card px-3 py-1.5 text-sm"
        >
          Reset icon layout
        </button>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">{title}</h2>
      {children}
    </section>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm capitalize transition ${
        active ? "border-orange bg-orange text-white" : "border-paper-line bg-card hover:border-olive-dark/60"
      }`}
    >
      {label}
    </button>
  );
}
