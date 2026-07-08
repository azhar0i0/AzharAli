import { useIconStore, useSettingsStore } from "@/lib/desktop/store";

const WALLPAPERS: { id: "paper" | "olive" | "night" | "orange"; label: string; sw: string }[] = [
  { id: "paper", label: "Paper Grid", sw: "#f7f4e8" },
  { id: "olive", label: "Olive", sw: "#6b7a3f" },
  { id: "night", label: "Night", sw: "#1a1c17" },
  { id: "orange", label: "Sunset", sw: "#f08a24" },
];

export function SettingsApp() {
  const { theme, setTheme, wallpaper, setWallpaper, soundsMuted, toggleSounds } = useSettingsStore();
  const resetIcons = useIconStore((s) => s.reset);
  return (
    <div className="h-full overflow-y-auto p-6 scrollbar-thin">
      <h1 className="text-2xl font-bold text-olive-dark">Settings</h1>
      <p className="text-sm text-ink-soft">Personalize your AzharOS experience.</p>

      <Group title="Theme">
        <div className="flex gap-2">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded-md border px-3 py-1.5 text-sm capitalize ${
                theme === t
                  ? "border-orange bg-orange text-white"
                  : "border-paper-line bg-card"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Wallpaper">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {WALLPAPERS.map((w) => (
            <button
              key={w.id}
              onClick={() => setWallpaper(w.id)}
              className={`overflow-hidden rounded-md border ${
                wallpaper === w.id ? "border-orange ring-2 ring-orange/30" : "border-paper-line"
              }`}
            >
              <div className="h-16" style={{ background: w.sw }} />
              <div className="bg-card p-1.5 text-center text-xs">{w.label}</div>
            </button>
          ))}
        </div>
      </Group>

      <Group title="Sounds">
        <button
          onClick={toggleSounds}
          className="rounded-md border border-paper-line bg-card px-3 py-1.5 text-sm"
        >
          {soundsMuted ? "🔇 Muted" : "🔊 On"}
        </button>
      </Group>

      <Group title="Desktop">
        <button
          onClick={resetIcons}
          className="rounded-md border border-paper-line bg-card px-3 py-1.5 text-sm"
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
