import { useEffect, useRef, useState } from "react";
import { useSettingsStore, useWindowStore } from "@/lib/desktop/store";

type Line = { kind: "in" | "out" | "sys"; text: string };

const BANNER = [
  "AzharOS v1.0 — type `help` for commands.",
];

export function TerminalApp() {
  const [lines, setLines] = useState<Line[]>(BANNER.map((t) => ({ kind: "sys", text: t })));
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const openApp = useWindowStore((s) => s.open);
  const setTheme = useSettingsStore((s) => s.setTheme);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight });
  }, [lines]);

  const println = (text: string, kind: Line["kind"] = "out") =>
    setLines((l) => [...l, { kind, text }]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setLines((l) => [...l, { kind: "in", text: cmd }]);
    if (!cmd) return;
    const [name, ...args] = cmd.split(/\s+/);
    switch (name.toLowerCase()) {
      case "help":
        println("Available: help about projects skills contact resume github linkedin clear whoami neofetch date theme");
        break;
      case "about":
        openApp("about");
        println("Opening About window…");
        break;
      case "projects":
        openApp("projects");
        println("Opening Projects window…");
        break;
      case "skills":
        openApp("skills");
        println("Opening Skills window…");
        break;
      case "contact":
        openApp("contact");
        println("Opening Contact window…");
        break;
      case "resume":
        openApp("resume");
        println("Opening Resume window…");
        break;
      case "github":
        window.open("https://github.com/azhar0i0", "_blank");
        println("→ https://github.com/azhar0i0");
        break;
      case "linkedin":
        window.open("https://www.linkedin.com/in/skibidi-azhar", "_blank");
        println("→ https://www.linkedin.com/in/skibidi-azhar");
        break;
      case "clear":
        setLines([]);
        break;
      case "whoami":
        println("azhar@AzharOS");
        break;
      case "date":
        println(new Date().toString());
        break;
      case "theme": {
        const t = args[0];
        if (t === "light" || t === "dark") { setTheme(t); println(`Theme set to ${t}.`); }
        else println("usage: theme <light|dark>");
        break;
      }
      case "neofetch":
        println("┌───────────────────────────────────┐");
        println("│  azhar@AzharOS                    │");
        println("│  OS:     AzharOS v1.0             │");
        println("│  Shell:  react-sh                 │");
        println("│  Editor: VS Code                  │");
        println("│  Stack:  React · Next · TS · Tail │");
        println("│  Uptime: since 2022               │");
        println("└───────────────────────────────────┘");
        break;
      default:
        println(`command not found: ${name}`);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      if (input.trim()) {
        setHistory((h) => [...h, input]);
      }
      setInput("");
      setHIdx(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = hIdx === -1 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx === -1) return;
      const next = hIdx + 1;
      if (next >= history.length) { setHIdx(-1); setInput(""); }
      else { setHIdx(next); setInput(history[next]); }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex h-full flex-col bg-[#141613] font-mono text-sm text-green-300"
    >
      <div ref={scrollerRef} className="flex-1 overflow-y-auto p-3 leading-relaxed scrollbar-thin">
        {lines.map((l, i) => (
          <div key={i} className={l.kind === "in" ? "text-orange" : l.kind === "sys" ? "text-emerald-400" : "text-green-200"}>
            {l.kind === "in" ? <span className="text-emerald-500">azhar@os:~$ </span> : null}
            <span className="whitespace-pre-wrap">{l.text}</span>
          </div>
        ))}
        <div className="flex text-orange">
          <span className="text-emerald-500">azhar@os:~$&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            className="flex-1 bg-transparent outline-none"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
