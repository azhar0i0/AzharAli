import { PiGithubLogoFill, PiLinkedinLogoFill, PiEnvelopeSimple } from "react-icons/pi";
import avatar from "@/assets/avatar.jpg";
import { useWindowStore } from "@/lib/desktop/store";

const LINKS = [
  { href: "https://github.com/azhar0i0", label: "GitHub", icon: <PiGithubLogoFill /> },
  { href: "https://www.linkedin.com/in/skibidi-azhar", label: "LinkedIn", icon: <PiLinkedinLogoFill /> },
  { href: "mailto:azharisworking@gmail.com", label: "Email", icon: <PiEnvelopeSimple /> },
];

export function HomeApp() {
  const open = useWindowStore((s) => s.open);
  return (
    <div className="flex h-full flex-col overflow-y-auto px-8 py-8 scrollbar-thin">
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <img
            src={avatar}
            alt="Portrait of Azhar Ali"
            width={104}
            height={104}
            className="h-26 w-26 rounded-full border border-paper-line object-cover"
          />
          <span
            aria-hidden
            className="absolute bottom-1.5 right-1.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-online"
          />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-5xl leading-none tracking-tight text-olive-dark">
            Azhar Ali
          </h1>
          <p className="mt-2 text-[15px] text-ink-soft">
            Full-stack developer · React, Next.js, Node.js
          </p>
        </div>
      </div>

      <p className="mt-7 max-w-[60ch] text-[15px] leading-[1.7] text-ink">
        I build web and mobile products end to end: React and Next.js on the
        front, Node.js on the back. For three years I've taken ideas from a
        rough sketch to a shipped app, with close attention to speed,
        accessibility and the small interactions people notice.
      </p>

      <dl className="mt-7 grid grid-cols-2 gap-6 border-t border-paper-line pt-5 text-sm">
        <div>
          <dt className="text-ink-soft">Location</dt>
          <dd className="mt-0.5 font-medium">Bahawalpur, Pakistan</dd>
        </div>
        <div>
          <dt className="text-ink-soft">Availability</dt>
          <dd className="mt-0.5 font-medium">Open to freelance work</dd>
        </div>
      </dl>

      <div className="mt-7 grid max-w-sm grid-cols-2 gap-3">
        <button onClick={() => open("contact")} className="btn-primary h-10 px-5 text-sm">
          Hire me
        </button>
        <button onClick={() => open("resume")} className="btn-secondary h-10 px-5 text-sm">
          View resume
        </button>
      </div>

      <div className="mt-auto flex items-center gap-1 pt-8">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            aria-label={l.label}
            title={l.label}
            className="grid h-9 w-9 place-items-center rounded-md text-lg text-ink-soft transition-colors hover:bg-secondary hover:text-olive-dark"
          >
            {l.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
