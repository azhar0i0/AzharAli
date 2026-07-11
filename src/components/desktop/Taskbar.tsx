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
      <div data-chrome className="pixel-shadow pointer-events-auto absolute inset-x-0 bottom-0 z-[9999] flex h-12 items-center gap-2 border-t border-[var(--chrome-border)] bg-[var(--chrome)] px-2 text-[var(--chrome-fg)]">
        <button
          onClick={() => setStartOpen((v) => !v)}
          className={`flex items-center gap-2 rounded-md border border-[var(--chrome-border)] px-3 py-1.5 font-pixel text-base leading-none tracking-wide transition ${
            startOpen
              ? "bg-[var(--chrome-active)] text-white"
              : "bg-[var(--chrome-raised)] hover:brightness-125"
          }`}
        >
          <span className="grid h-5 w-5 place-items-center rounded-sm bg-[var(--chrome-active)] text-[10px] font-bold text-white">
            A
          </span>
          Start
        </button>

        <div className="mx-1 h-6 w-px bg-[var(--chrome-border)]" />

        <div className="flex flex-1 items-center gap-1 overflow-x-auto scrollbar-thin">
          {windows.map((w) => (
            <button
              key={w.id}
              onClick={() => toggleMinimize(w.id)}
              title={w.title}
              className={`flex max-w-[200px] items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition ${
                activeId === w.id && !w.minimized
                  ? "border-[var(--chrome-active)] bg-[var(--chrome-raised)] text-[var(--chrome-fg)]"
                  : "border-[var(--chrome-border)] bg-[var(--chrome-raised)]/50 text-[var(--chrome-fg-dim)] hover:bg-[var(--chrome-raised)] hover:text-[var(--chrome-fg)]"
              }`}
            >
              <AppIcon appId={w.appId} size={16} />
              <span className="truncate">{APP_META[w.appId].label}</span>
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a href="https://github.com/azhar0i0" target="_blank" rel="noreferrer" title="GitHub" className="grid h-8 w-8 place-items-center rounded-md border border-[var(--chrome-border)] bg-[var(--chrome-raised)] text-[var(--chrome-fg)] transition hover:bg-[var(--chrome-active)] hover:text-white"><Github size={18} /></a>
          <a href="https://www.linkedin.com/in/skibidi-azhar" target="_blank" rel="noreferrer" title="LinkedIn" className="grid h-8 w-8 place-items-center rounded-md border border-[var(--chrome-border)] bg-[var(--chrome-raised)] text-[var(--chrome-fg)] transition hover:bg-[var(--chrome-active)] hover:text-white"><Linkedin size={18} /></a>
          <a href="mailto:azharisworking@gmail.com" title="Email" className="grid h-8 w-8 place-items-center rounded-md border border-[var(--chrome-border)] bg-[var(--chrome-raised)] text-[var(--chrome-fg)] transition hover:bg-[var(--chrome-active)] hover:text-white"><FaEnvelope size={16} /></a>
        </div>
        <div className="ml-1 rounded-md bg-[var(--chrome-raised)] px-3 py-1 text-center font-pixel text-sm leading-tight tracking-wide">
          <div>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
          <div className="text-[var(--chrome-fg-dim)]">{now.toLocaleDateString([], { month: "short", day: "numeric" })}</div>
        </div>
      </div>
    </>
  );
}
