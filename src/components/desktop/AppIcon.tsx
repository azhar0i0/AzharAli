import type { AppId } from "@/lib/desktop/store";
import {
  FaFolder,
  FaUser,
  FaCode,
  FaBriefcase,
  FaEnvelope,
  FaFileAlt,
  FaTerminal,
  FaCog,
  FaHome,
} from "react-icons/fa";

const ICONS: Record<AppId, { icon: React.ReactNode; color: string }> = {
  home: { icon: <FaHome />, color: "#f08a24" },
  about: { icon: <FaUser />, color: "#4a6d8c" },
  projects: { icon: <FaFolder />, color: "#f2c94c" },
  skills: { icon: <FaCode />, color: "#6b7a3f" },
  services: { icon: <FaBriefcase />, color: "#b2542a" },
  contact: { icon: <FaEnvelope />, color: "#c94c4c" },
  resume: { icon: <FaFileAlt />, color: "#3d4a2a" },
  terminal: { icon: <FaTerminal />, color: "#1a1c17" },
  settings: { icon: <FaCog />, color: "#6b6852" },
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
