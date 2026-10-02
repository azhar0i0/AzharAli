import type { AppId } from "@/lib/desktop/store";
import {
  PiFolderSimpleFill,
  PiUserFill,
  PiCodeFill,
  PiBriefcaseFill,
  PiEnvelopeSimpleFill,
  PiFileTextFill,
  PiTerminalWindowFill,
  PiGearSixFill,
  PiHouseFill,
} from "react-icons/pi";

const ICONS: Record<AppId, { icon: React.ReactNode; color: string }> = {
  home: { icon: <PiHouseFill />, color: "#f08a24" },
  about: { icon: <PiUserFill />, color: "#4a6d8c" },
  projects: { icon: <PiFolderSimpleFill />, color: "#f2c94c" },
  skills: { icon: <PiCodeFill />, color: "#6b7a3f" },
  services: { icon: <PiBriefcaseFill />, color: "#b2542a" },
  contact: { icon: <PiEnvelopeSimpleFill />, color: "#c94c4c" },
  resume: { icon: <PiFileTextFill />, color: "#3d4a2a" },
  terminal: { icon: <PiTerminalWindowFill />, color: "#1a1c17" },
  settings: { icon: <PiGearSixFill />, color: "#6b6852" },
};

export function AppIcon({ appId, size = 32 }: { appId: AppId; size?: number }) {
  const { icon, color } = ICONS[appId];
  const isFolder = appId === "projects";
  if (isFolder) {
    return (
      <span
        aria-hidden
        style={{ width: size, height: size * 0.85 }}
        className="relative folder-shadow inline-block"
      >
        <span className="absolute left-0 top-0 h-1/3 w-1/2 rounded-t-[3px] bg-[color:var(--color-folder-tab)]" />
        <span className="absolute inset-x-0 bottom-0 h-[85%] rounded-[3px] rounded-tl-none border border-black/10 bg-[color:var(--color-folder)]" />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        background: `linear-gradient(180deg, ${color}22, ${color}44)`,
        color,
      }}
      className="folder-shadow grid place-items-center rounded-lg border border-black/10 text-[60%]"
    >
      <span style={{ fontSize: size * 0.5 }}>{icon}</span>
    </span>
  );
}

/** Bare glyph for dark chrome (taskbar, title bars) — inherits text color. */
export function AppGlyph({ appId, size = 16, className = "" }: { appId: AppId; size?: number; className?: string }) {
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center ${className}`} style={{ fontSize: size }}>
      {ICONS[appId].icon}
    </span>
  );
}
