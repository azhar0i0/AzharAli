import {
  THEMES,
  useIconStore,
  useSettingsStore,
  type AnimSpeed,
  type CursorStyle,
  type IconSize,
} from "@/lib/desktop/store";
import {
  FaVolumeMute,
  FaVolumeUp,
  FaCheck,
} from "react-icons/fa";

export function SettingsApp() {
  const {
    theme, setTheme,
    soundsMuted, toggleSounds,
    iconSize, setIconSize,
    cursorStyle, setCursorStyle,
    animSpeed, setAnimSpeed,
    parallax, toggleParallax,
  } = useSettingsStore();
  const resetIcons = useIconStore((s) => s.reset);

  return (
    <div className="h-full overflow-y-auto p-6 scrollbar-thin">
      <h1 className="font-pixel text-3xl tracking-wide text-olive-dark">Settings</h1>
      <p className="text-sm text-ink-soft">Personalize your AzharOS experience.</p>

      <Group title="Theme">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`cursor-pointer overflow-hidden rounded-md border text-left transition ${
                theme === t.id
                  ? "border-orange ring-2 ring-orange/30"
                  : "border-paper-line hover:border-olive-dark/60"
              }`}
              aria-label={`Theme ${t.label}`}
            >
              {/* Live preview: the theme class resolves --wallpaper for this swatch */}
              <div className={`theme-${t.id} relative h-16`}>
                <div className="desktop-wallpaper absolute inset-0" />
                <div className="pixel-grid absolute inset-0" />
                <span
                  className="absolute bottom-1 right-1 h-4 w-4 rounded-sm ring-1 ring-black/20"
                  style={{ background: t.accent }}
                />
                {theme === t.id && (
                  <FaCheck className="absolute left-1 top-1 text-white drop-shadow" />
                )}
              </div>
              <div className="flex items-center justify-between bg-card px-2 py-1.5">
                <span className="font-pixel text-sm tracking-wide">{t.label}</span>
                <span className="text-[10px] uppercase tracking-wider text-ink-soft">{t.mode}</span>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Each theme sets its own wallpaper, text colors, taskbar and accent — everything stays readable.
        </p>
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
