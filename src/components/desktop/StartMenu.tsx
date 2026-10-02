import { AnimatePresence, motion } from "framer-motion";
import { useWindowStore, type AppId } from "@/lib/desktop/store";
import { APP_META } from "@/lib/desktop/apps";
import { AppIcon } from "./AppIcon";
import { PiGithubLogoFill, PiLinkedinLogoFill, PiEnvelopeSimple, PiPower, PiDownloadSimple } from "react-icons/pi";

const ITEMS: AppId[] = ["home", "about", "projects", "skills", "services", "resume", "contact", "terminal", "settings"];

export function StartMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const openApp = useWindowStore((s) => s.open);
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="absolute inset-0 z-(--z-menu-backdrop)" onClick={onClose} />
          <motion.div
            data-chrome
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="absolute bottom-14 left-2 z-(--z-menu) w-72 overflow-hidden rounded-lg border border-[var(--chrome-border)] bg-[var(--chrome)] shadow-[inset_0_1px_0_rgb(255_255_255/0.1)] window-shadow"
          >
            <div className="flex items-center gap-2 px-3 py-2 text-[var(--chrome-fg)]">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--chrome-active)] font-bold text-accent-foreground">A</span>
              <div className="leading-tight">
                <div className="font-pixel text-base tracking-wide">Azhar Ali</div>
                <div className="font-mono text-[10px] text-[var(--chrome-fg-dim)]">@azharisworking</div>
              </div>
            </div>
            <ul className="bezel-core mx-[3px] max-h-72 overflow-y-auto bg-card p-1 scrollbar-thin">
              {ITEMS.map((id) => (
                <li key={id}>
                  <button
                    onClick={() => { openApp(id); onClose(); }}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary active:bg-paper-line/60"
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
            <div className="bezel-core mx-[3px] mt-[3px] grid grid-cols-4 gap-1 bg-secondary p-1.5 text-ink-soft">
              <StartLink href="https://github.com/azhar0i0" title="GitHub"><PiGithubLogoFill /></StartLink>
              <StartLink href="https://www.linkedin.com/in/skibidi-azhar" title="LinkedIn"><PiLinkedinLogoFill /></StartLink>
              <StartLink href="mailto:azharisworking@gmail.com" title="Email"><PiEnvelopeSimple /></StartLink>
              <button
                title="Download vCard" aria-label="Download vCard"
                onClick={() => downloadVCard()}
                className="grid h-9 place-items-center rounded-md transition hover:bg-[var(--chrome-active)] hover:text-accent-foreground"
              >
                <PiDownloadSimple />
              </button>
            </div>
            <button
              onClick={() => { onClose(); shutdownAnim(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--chrome-fg)] hover:brightness-125 cursor-pointer"
            >
              <PiPower style={{ color: "var(--chrome-active)" }} /> Restart system
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
      aria-label={title}
      className="grid h-9 place-items-center rounded-md transition hover:bg-[var(--chrome-active)] hover:text-accent-foreground"
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
    "position:fixed;inset:0;background:var(--paper);color:var(--ink-soft);font-family:var(--font-sans);font-size:14px;display:grid;place-items:center;z-index:var(--z-boot);opacity:0;transition:opacity .4s";
  overlay.textContent = "Restarting…";
  document.body.appendChild(overlay);
  requestAnimationFrame(() => (overlay.style.opacity = "1"));
  setTimeout(() => {
    overlay.textContent = "Back in a moment";
  }, 1400);
  setTimeout(() => {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 500);
  }, 2600);
}
