import { AnimatePresence, motion } from "framer-motion";
import { useWindowStore, type AppId } from "@/lib/desktop/store";
import { APP_META } from "@/lib/desktop/apps";
import { AppIcon } from "./AppIcon";
import { FaGithub, FaLinkedin, FaEnvelope, FaPowerOff, FaFileDownload } from "react-icons/fa";

const ITEMS: AppId[] = ["home", "about", "projects", "skills", "services", "resume", "contact", "terminal", "settings"];

export function StartMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const openApp = useWindowStore((s) => s.open);
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="absolute inset-0 z-[9998]" onClick={onClose} />
          <motion.div
            data-chrome
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute bottom-14 left-2 z-[9999] w-72 overflow-hidden rounded-lg border border-[var(--chrome-border)] bg-card window-shadow"
          >
            <div className="flex items-center gap-2 border-b border-[var(--chrome-border)] bg-[var(--chrome)] px-3 py-2 text-[var(--chrome-fg)]">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--chrome-active)] font-bold text-white">A</span>
              <div className="leading-tight">
                <div className="font-pixel text-base tracking-wide">Azhar Ali</div>
                <div className="font-mono text-[10px] text-[var(--chrome-fg-dim)]">@azharisworking</div>
              </div>
            </div>
            <ul className="max-h-72 overflow-y-auto p-1 scrollbar-thin">
              {ITEMS.map((id) => (
                <li key={id}>
                  <button
                    onClick={() => { openApp(id); onClose(); }}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm hover:bg-secondary"
                  >
                    <AppIcon appId={id} size={22} />
                    <span className="flex-1">
                      <span className="block font-medium">{APP_META[id].label}</span>
                      <span className="block text-[11px] text-ink-soft">{APP_META[id].hint}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-4 gap-1 border-t border-[var(--chrome-border)] bg-secondary/60 p-2 text-ink-soft">
              <StartLink href="https://github.com/azhar0i0" title="GitHub"><FaGithub /></StartLink>
              <StartLink href="https://www.linkedin.com/in/skibidi-azhar" title="LinkedIn"><FaLinkedin /></StartLink>
              <StartLink href="mailto:azharisworking@gmail.com" title="Email"><FaEnvelope /></StartLink>
              <button
                title="Download vCard"
                onClick={() => downloadVCard()}
                className="grid h-9 place-items-center rounded-md transition hover:bg-[var(--chrome-active)] hover:text-white"
              >
                <FaFileDownload />
              </button>
            </div>
            <button
              onClick={() => { onClose(); shutdownAnim(); }}
              className="flex w-full items-center gap-2 border-t border-[var(--chrome-border)] bg-[var(--chrome)] px-3 py-2 text-sm text-[var(--chrome-fg)] hover:brightness-125 cursor-pointer"
            >
              <FaPowerOff style={{ color: "var(--chrome-active)" }} /> Restart System
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StartLink({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      title={title}
      className="grid h-9 place-items-center rounded-md transition hover:bg-[var(--chrome-active)] hover:text-white"
    >
      {children}
    </a>
  );
}

function downloadVCard() {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Azhar Ali",
    "TITLE:Full-Stack Developer",
    "EMAIL:azharisworking@gmail.com",
    "TEL:+923298892016",
    "ADR:;;;Bahawalpur;;;Pakistan",
    "URL:https://github.com/azhar0i0",
    "END:VCARD",
  ].join("\n");
  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "AzharAli.vcf";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function shutdownAnim() {
  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;inset:0;background:#000;color:#a8b47a;font-family:VT323,monospace;font-size:22px;display:grid;place-items:center;z-index:99999;opacity:0;transition:opacity .4s";
  overlay.textContent = "Shutting down AzharOS…";
  document.body.appendChild(overlay);
  requestAnimationFrame(() => (overlay.style.opacity = "1"));
  setTimeout(() => {
    overlay.textContent = "It's now safe to explore again.";
  }, 1400);
  setTimeout(() => {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 500);
  }, 2600);
}
