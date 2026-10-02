import { useEffect, useState } from "react";
import {
  PiGithubLogoFill,
  PiLinkedinLogoFill,
  PiEnvelopeSimple,
  PiSquaresFourFill,
} from "react-icons/pi";
import { useWindowStore } from "@/lib/desktop/store";
import { APP_META } from "@/lib/desktop/apps";
import { AppGlyph } from "./AppIcon";
import { StartMenu } from "./StartMenu";

const LINKS = [
  { href: "https://github.com/azhar0i0", label: "GitHub", icon: <PiGithubLogoFill size={18} /> },
  { href: "https://www.linkedin.com/in/skibidi-azhar", label: "LinkedIn", icon: <PiLinkedinLogoFill size={18} /> },
  { href: "mailto:azharisworking@gmail.com", label: "Email", icon: <PiEnvelopeSimple size={18} /> },
];

/* Every taskbar control shares this box so heights and hover states match. */
const ITEM =
  "flex h-9 items-center rounded-md transition-colors duration-200 hover:bg-[var(--chrome-raised)] active:translate-y-px";

export function Taskbar() {
  const { windows, activeId, toggleMinimize } = useWindowStore();
  const [startOpen, setStartOpen] = useState(false);
  // Clock is client-only: server time/locale would never match the browser's
  // and trigger a hydration mismatch.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <StartMenu open={startOpen} onClose={() => setStartOpen(false)} />
      <div
        data-chrome
        className="pixel-shadow pointer-events-auto absolute inset-x-0 bottom-0 z-(--z-taskbar) flex h-12 items-center gap-1 border-t border-[var(--chrome-border)] bg-[var(--chrome)] px-2 text-[var(--chrome-fg)]"
      >
        <button
          onClick={() => setStartOpen((v) => !v)}
          aria-expanded={startOpen}
          className={`${ITEM} gap-2 px-3 text-sm font-semibold ${
            startOpen ? "bg-[var(--chrome-raised)] ring-1 ring-inset ring-[var(--chrome-active)]" : ""
          }`}
        >
          <PiSquaresFourFill size={20} className="text-[var(--chrome-active)]" />
          Start
        </button>

        <div className="mx-1 h-5 w-px bg-[var(--chrome-fg)]/15" />

        <nav aria-label="Open windows" className="flex flex-1 items-center gap-1 overflow-x-auto scrollbar-thin">
          {windows.map((w) => {
            const active = activeId === w.id && !w.minimized;
            return (
              <button
                key={w.id}
                onClick={() => toggleMinimize(w.id)}
                title={w.title}
                aria-pressed={active}
                className={`${ITEM} relative max-w-[180px] shrink-0 gap-2 px-3 text-[13px] ${
                  active
                    ? "bg-[var(--chrome-raised)] text-[var(--chrome-fg)]"
                    : "text-[var(--chrome-fg-dim)] hover:text-[var(--chrome-fg)]"
                }`}
              >
                <AppGlyph
                  appId={w.appId}
                  size={16}
                  className={active ? "text-[var(--chrome-active)]" : ""}
                />
                <span className="truncate">{APP_META[w.appId].label}</span>
                {/* Running indicator: accent bar when focused, short dim bar when
                    open behind other windows, none when minimized. */}
                <span
                  aria-hidden
                  className={`absolute bottom-0.5 left-1/2 h-[3px] -translate-x-1/2 rounded-full transition-all duration-300 ${
                    active
                      ? "w-6 bg-[var(--chrome-active)]"
                      : w.minimized
                        ? "w-0 bg-transparent"
                        : "w-2 bg-[var(--chrome-fg-dim)]"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-0.5 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              title={l.label}
              aria-label={l.label}
              className={`${ITEM} w-9 justify-center text-[var(--chrome-fg-dim)] hover:text-[var(--chrome-fg)]`}
            >
              {l.icon}
            </a>
          ))}
        </div>

        <div className="mx-1 hidden h-5 w-px bg-[var(--chrome-fg)]/15 md:block" />

        <div className="min-w-16 px-2 text-right text-xs leading-tight tabular">
          {now && (
            <>
              <time className="block font-medium" dateTime={now.toISOString()}>
                {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </time>
              <div className="text-[var(--chrome-fg-dim)]">
                {now.toLocaleDateString([], { month: "short", day: "numeric" })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
