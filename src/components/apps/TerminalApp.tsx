import { useEffect, useRef, useState } from "react";
import { useSettingsStore, useWindowStore } from "@/lib/desktop/store";

type Line = { kind: "in" | "out" | "sys" | "err"; text: string };

const BANNER = [
  "AzharOS v1.0  —  React · Next · TypeScript",
  "Type `help` to see available commands.",
];

const SKILLS = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "Redux"],
  backend: ["Node.js", "Express", "Supabase", "Firebase", "Django"],
  db: ["PostgreSQL", "MongoDB", "MySQL"],
  tools: ["Git", "Figma", "Vite", "Vercel"],
};

const PROJECTS = [
  { name: "Shop Buddy", stack: "React · Node · JWT", url: "https://github.com/azhar0i0" },
  { name: "E-Commerce Site", stack: "Next.js · Stripe", url: "https://github.com/azhar0i0" },
  { name: "AzharOS Portfolio", stack: "TanStack · Zustand · Framer", url: "https://github.com/azhar0i0" },
];

const CONTACT = [
  ["Email   ", "azharisworking@gmail.com"],
  ["Phone   ", "+92 329 8892016"],
  ["Location", "Bahawalpur, Pakistan"],
  ["GitHub  ", "https://github.com/azhar0i0"],
  ["LinkedIn", "https://www.linkedin.com/in/skibidi-azhar"],
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

  const push = (text: string, kind: Line["kind"] = "out") =>
    setLines((l) => [...l, { kind, text }]);
  const pushMany = (arr: string[], kind: Line["kind"] = "out") =>
    setLines((l) => [...l, ...arr.map((text) => ({ kind, text }))]);

  const commands: Record<string, (args: string[]) => void> = {
    help: () => pushMany([
      "Commands:",
      "  help                  show this list",
      "  about                 open About window",
      "  projects [--list]     open Projects, or list in-terminal",
      "  skills [category]     list skills (frontend|backend|db|tools)",
      "  contact               show contact info",
      "  resume                open Resume window",
      "  github                open GitHub profile",
      "  linkedin              open LinkedIn profile",
      "  email                 open mail client",
      "  neofetch              system info",
      "  theme <light|dark>    change theme",
      "  date                  current date/time",
      "  whoami                current user",
      "  echo <text>           print text",
      "  clear                 clear screen",
      "  exit                  close terminal",
    ]),
    about: () => { openApp("about"); push("Opening About…"); },
    resume: () => { openApp("resume"); push("Opening Resume…"); },
    projects: (args) => {
      if (args[0] === "--list" || args[0] === "-l") {
        push("Featured projects:");
        PROJECTS.forEach((p, i) => push(`  ${i + 1}. ${p.name.padEnd(22)} ${p.stack}`));
        push(`  → visit: ${PROJECTS[0].url}`);
      } else {
        openApp("projects");
        push("Opening Projects… (use `projects --list` to view here)");
      }
    },
    skills: (args) => {
      const cat = args[0]?.toLowerCase();
      const show = (label: string, arr: string[]) => push(`  ${label.padEnd(10)} ${arr.join(", ")}`);
      push("Skills:");
      if (!cat || cat === "frontend") show("frontend", SKILLS.frontend);
      if (!cat || cat === "backend") show("backend", SKILLS.backend);
      if (!cat || cat === "db") show("db", SKILLS.db);
      if (!cat || cat === "tools") show("tools", SKILLS.tools);
    },
    contact: () => {
      push("Contact:");
      CONTACT.forEach(([k, v]) => push(`  ${k}  ${v}`));
    },
    github: () => { window.open("https://github.com/azhar0i0", "_blank"); push("→ https://github.com/azhar0i0"); },
    linkedin: () => { window.open("https://www.linkedin.com/in/skibidi-azhar", "_blank"); push("→ https://www.linkedin.com/in/skibidi-azhar"); },
    email: () => { window.open("mailto:azharisworking@gmail.com"); push("→ mailto:azharisworking@gmail.com"); },
    clear: () => setLines([]),
    whoami: () => push("azhar@AzharOS"),
    date: () => push(new Date().toString()),
    echo: (args) => push(args.join(" ")),
    exit: () => {
      const w = useWindowStore.getState().windows.find((x) => x.appId === "terminal");
      if (w) useWindowStore.getState().close(w.id);
    },
    theme: (args) => {
      const t = args[0];
      if (t === "light" || t === "dark") { setTheme(t); push(`Theme set to ${t}.`); }
      else push("usage: theme <light|dark>", "err");
    },
    neofetch: () => pushMany([
      "        _         _                     azhar@AzharOS",
      "       /_\\  ___ _| |__  __ _ _ _        ---------------",
      "      / _ \\/ _ \\ ' \\ \\ // _` | '_|       OS      AzharOS v1.0",
      "     /_/ \\_\\___/_||_/_\\_\\__,_|_|         Shell   react-sh",
      "                                         Editor  VS Code",
      "                                         Stack   React · Next · TS · Tailwind",
      "                                         Theme   " + useSettingsStore.getState().theme,
      "                                         Uptime  since 2022",
    ], "sys"),
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    setLines((l) => [...l, { kind: "in", text: cmd }]);
    if (!cmd) return;
    const [name, ...args] = cmd.split(/\s+/);
    const fn = commands[name.toLowerCase()];
    if (fn) fn(args);
    else push(`command not found: ${name} — try \`help\``, "err");
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      if (input.trim()) setHistory((h) => [...h, input]);
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
    } else if (e.key === "Tab") {
      e.preventDefault();
      const names = Object.keys(commands);
      const match = names.find((n) => n.startsWith(input.trim()));
      if (match) setInput(match + " ");
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex h-full flex-col bg-[#0f1210] font-mono text-sm text-green-300"
    >
      <div ref={scrollerRef} className="flex-1 overflow-y-auto p-3 leading-relaxed scrollbar-thin">
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.kind === "in" ? "text-orange" :
              l.kind === "sys" ? "text-emerald-400" :
              l.kind === "err" ? "text-red-400" :
              "text-green-200"
            }
          >
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
