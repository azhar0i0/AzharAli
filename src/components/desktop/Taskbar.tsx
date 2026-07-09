import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useWindowStore } from "@/lib/desktop/store";
import { APP_META } from "@/lib/desktop/apps";
import { AppIcon } from "./AppIcon";
import { StartMenu } from "./StartMenu";
import { Github, Linkedin } from "lucide-react";

export function Taskbar() {
  const { windows, activeId, toggleMinimize } = useWindowStore();
  const [startOpen, setStartOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <StartMenu open={startOpen} onClose={() => setStartOpen(false)} />
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-[9999] flex h-12 items-center gap-2 border-t border-olive-dark/70 bg-olive px-2 text-paper shadow-[0_-2px_8px_rgba(0,0,0,0.15)]">
        <button
          onClick={() => setStartOpen((v) => !v)}
          className={`flex items-center gap-2 rounded-md border border-olive-dark/60 px-3 py-1.5 text-sm font-semibold transition ${
            startOpen ? "bg-orange text-white" : "bg-olive-dark hover:bg-olive-dark/80"
          }`}
        >
          <span className="grid h-5 w-5 place-items-center rounded-sm bg-orange text-[10px] font-bold text-white">
            A
          </span>
          Start
        </button>

        <div className="mx-1 h-6 w-px bg-olive-dark/60" />

        <div className="flex flex-1 items-center gap-1 overflow-x-auto scrollbar-thin">
          {windows.map((w) => (
            <button
              key={w.id}
              onClick={() => toggleMinimize(w.id)}
              title={w.title}
              className={`flex max-w-[200px] items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition ${
                activeId === w.id && !w.minimized
                  ? "border-orange bg-olive-dark text-white"
                  : "border-olive-dark/50 bg-olive/70 hover:bg-olive-dark/50"
              }`}
            >
              <AppIcon appId={w.appId} size={16} />
              <span className="truncate">{APP_META[w.appId].label}</span>
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 text-paper/80 md:flex">
          <a href="https://github.com/azhar0i0" target="_blank" rel="noreferrer" className="px-1 py-1 bg-[#F7F4E8] hover:bg-accent border-2 border-primary rounded-md text-primary"><Github /></a>
          <a href="https://www.linkedin.com/in/skibidi-azhar" target="_blank" rel="noreferrer" className="px-1 py-1 bg-[#F7F4E8] hover:bg-accent border-2 border-primary rounded-md text-primary"><Linkedin /></a>
          <a href="mailto:azharisworking@gmail.com" className="px-2 py-2 bg-[#F7F4E8] hover:bg-accent border-2 border-primary rounded-md text-primary"><FaEnvelope /></a>
        </div>
        <div className="ml-1 rounded-md bg-olive-dark px-4 py-1 text-center font-mono text-[11px] leading-tight">
          <div>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
          <div className="text-paper/60">{now.toLocaleDateString([], { month: "short", day: "numeric" })}</div>
        </div>
      </div>
    </>
  );
}
