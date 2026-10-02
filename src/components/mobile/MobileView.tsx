import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { reveal } from "@/lib/motion";
import {
  PiGithubLogoFill,
  PiLinkedinLogoFill,
  PiEnvelopeSimple,
  PiPhone,
  PiMapPin,
  PiUser,
  PiFolderOpen,
  PiDownloadSimple,
} from "react-icons/pi";
import type { ReactNode } from "react";
import avatar from "@/assets/avatar.jpg";
import { getTheme, THEMES, useSettingsStore } from "@/lib/desktop/store";

const THEME_CLASSES = THEMES.map((t) => `theme-${t.id}`);
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { SkillMeter } from "@/components/apps/SkillMeter";
import { BootScreen } from "@/components/desktop/BootScreen";

/* ============================ data ============================ */

const TIMELINE = [
  {
    year: "2026",
    title: "DevOps & AI Developer",
    detail: "Exploring the intersection of DevOps practices and AI technologies.",
  },
  {
    year: "2025",
    title: "Backend Developer",
    detail: "Working on Node.js & Express for better performance.",
  },
  {
    year: "2024",
    title: "Freelance Full-Stack Developer",
    detail: "Shipping React/Next.js apps for clients globally.",
  },
  {
    year: "2023",
    title: "Frontend Developer",
    detail: "Focused on design systems, animations & performance.",
  },
  {
    year: "2022",
    title: "Started Web Development",
    detail: "Fell in love with React and modern UI engineering.",
  },
];

const VALUES = [
  { k: "Craft", v: "Pixel-perfect UI with attention to motion & detail." },
  { k: "Clarity", v: "Clean architecture, readable code, honest docs." },
  { k: "Curiosity", v: "Always exploring new tools, patterns, and ideas." },
  { k: "Impact", v: "Ship things that solve real problems for real people." },
];

type Skill = { name: string; years: number; level: number };
const SKILL_GROUPS: { title: string; skills: Skill[] }[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", years: 2, level: 92 },
      { name: "Next.js", years: 2, level: 88 },
      { name: "TypeScript", years: 2, level: 85 },
      { name: "JavaScript", years: 3, level: 94 },
      { name: "Tailwind CSS", years: 2, level: 95 },
      { name: "Framer Motion", years: 1, level: 78 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", years: 2, level: 82 },
      { name: "Express", years: 2, level: 80 },
      { name: "Supabase", years: 1, level: 78 },
      { name: "Firebase", years: 2, level: 76 },
      { name: "Django", years: 1, level: 65 },
      { name: "WordPress", years: 2, level: 80 },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "MongoDB", years: 2, level: 82 },
      { name: "PostgreSQL", years: 1, level: 74 },
      { name: "MySQL", years: 2, level: 76 },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git & GitHub", years: 3, level: 90 },
      { name: "Figma", years: 2, level: 78 },
      { name: "Canva", years: 2, level: 82 },
    ],
  },
];

const SERVICES: { title: string; desc: string; tags: string[] }[] = [
  {
    title: "Web development",
    desc: "Modern, fast, accessible websites and web apps built with the React ecosystem.",
    tags: ["React", "Next.js", "Tailwind"],
  },
  {
    title: "App development",
    desc: "Cross-platform mobile experiences that feel native on iOS and Android.",
    tags: ["React Native"],
  },
  {
    title: "Backend development",
    desc: "APIs, auth, databases, real-time — all the plumbing that keeps apps alive.",
    tags: ["Node.js", "Django", "Firebase"],
  },
  {
    title: "WordPress sites",
    desc: "Business sites and blogs on WordPress, set up so you can update pages and posts yourself.",
    tags: ["WordPress"],
  },
  {
    title: "UI design",
    desc: "Design systems and interfaces that look great and stay consistent as you scale.",
    tags: ["Figma"],
  },
  {
    title: "Performance & SEO",
    desc: "Faster load times, smoother interactions, and the technical SEO that helps pages get found.",
    tags: ["Lighthouse"],
  },
  {
    title: "SaaS, e-commerce & POS",
    desc: "Subscription products, online stores and point-of-sale systems, from data model to checkout.",
    tags: ["React", "Node.js"],
  },
];

const EXPERIENCE = [
  {
    role: "Freelance Full-Stack Developer",
    org: "Self-employed",
    date: "2024 — Present",
    bullets: [
      "Design & ship React/Next.js applications for clients globally.",
      "Build dashboards, e-commerce sites, and management systems.",
      "Own product from Figma to deploy on Vercel/Netlify.",
    ],
  },
  {
    role: "Frontend Developer",
    org: "Contract",
    date: "2023 — 2024",
    bullets: [
      "Built animated marketing sites with Framer Motion & GSAP.",
      "Set up reusable design systems on top of Tailwind CSS.",
    ],
  },
];

/* ============================ hooks ============================ */

/* ============================ shell ============================ */

type Tab = "me" | "work";

export function MobileView() {
  const [tab, setTab] = useState<Tab>("me");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const theme = useSettingsStore((s) => s.theme);
  const themeDef = getTheme(theme);

  // Keep the persisted theme working without the desktop shell mounted.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...THEME_CLASSES);
    root.classList.add(`theme-${themeDef.id}`);
    root.classList.toggle("dark", themeDef.mode === "dark");
  }, [themeDef.id, themeDef.mode]);

  const goToSection = (id: string) => {
    setTab("me");
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-paper text-ink">
      {/* subtle CRT scanline for retro vibe */}
      <div className="pointer-events-none fixed inset-0 z-(--z-overlay) opacity-[0.04] [background:repeating-linear-gradient(to_bottom,#000_0px,#000_1px,transparent_1px,transparent_3px)]" />

      {/* title bar */}
      <header className="flex shrink-0 items-center gap-2 border-b border-olive-dark/60 bg-olive-dark px-3 py-2 text-paper">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-orange" />
          <span className="h-2.5 w-2.5 rounded-full bg-paper/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-paper/40" />
        </div>
        <span className="ml-1 font-mono text-xs tracking-tight">
          C:\AzharAli\{tab === "me" ? "Profile" : "Projects"}
        </span>
        <span className="ml-auto grid h-5 w-5 place-items-center rounded-sm bg-orange text-[11px] font-bold text-accent-foreground">
          A
        </span>
      </header>

      {/* content */}
      <main className="relative flex-1 overflow-hidden">
        <div
          ref={scrollerRef}
          className={`h-full overflow-y-auto scrollbar-thin ${tab === "me" ? "" : "hidden"}`}
        >
          <MePage onContact={() => goToSection("contact")} onResume={() => goToSection("resume")} />
        </div>
        <div className={`relative h-full ${tab === "work" ? "" : "hidden"}`}>
          <ProjectsApp />
        </div>
      </main>

      {/* bottom tab bar */}
      <nav className="flex shrink-0 items-stretch border-t border-olive-dark/70 bg-olive text-paper shadow-[0_-2px_8px_rgba(0,0,0,0.15)]">
        <TabButton
          active={tab === "me"}
          onClick={() => setTab("me")}
          icon={<PiUser />}
          label="Me"
        />
        <TabButton
          active={tab === "work"}
          onClick={() => setTab("work")}
          icon={<PiFolderOpen />}
          label="Work"
        />
      </nav>

      <BootScreen />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs font-semibold transition active:scale-95 ${
        active ? "text-paper" : "text-paper/60"
      }`}
    >
      {active && (
        <motion.span
          layoutId="tab-underline"
          className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-orange"
        />
      )}
      <span className={`text-lg ${active ? "text-orange" : ""}`}>{icon}</span>
      {label}
    </button>
  );
}

/* ============================ Me page ============================ */

function MePage({ onContact, onResume }: { onContact: () => void; onResume: () => void }) {
  return (
    <div className="pb-10">
      {/* hero */}
      <section className="border-b border-paper-line bg-card px-5 pb-8 pt-7">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={avatar}
              alt="Portrait of Azhar Ali"
              width={80}
              height={80}
              className="h-20 w-20 rounded-full border border-paper-line object-cover"
            />
            <span
              aria-hidden
              className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-card bg-online"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-4xl leading-none tracking-tight text-olive-dark">
              Azhar Ali
            </h1>
            <p className="mt-1.5 text-sm text-ink-soft">Full-stack developer</p>
          </div>
        </div>

        <p className="mt-5 leading-relaxed text-ink">
          I build web and mobile products end to end: React and Next.js on the front, Node.js on
          the back. For three years I've taken ideas from a rough sketch to a shipped app, with close
          attention to speed, accessibility and the small interactions people notice.
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-paper-line pt-4 text-sm">
          <div>
            <dt className="text-ink-soft">Location</dt>
            <dd className="mt-0.5 font-medium">Bahawalpur, PK</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Availability</dt>
            <dd className="mt-0.5 font-medium">Open to work</dd>
          </div>
        </dl>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={onContact} className="btn-primary h-11 px-4 text-sm">
            Hire me
          </button>
          <button onClick={onResume} className="btn-secondary h-11 px-4 text-sm">
            View resume
          </button>
        </div>

        <div className="mt-5 flex items-center gap-1 text-xl text-ink-soft">
          <a
            href="https://github.com/azhar0i0"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="grid h-10 w-10 place-items-center rounded-md transition-colors active:bg-secondary"
          >
            <PiGithubLogoFill />
          </a>
          <a
            href="https://www.linkedin.com/in/skibidi-azhar"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="grid h-10 w-10 place-items-center rounded-md transition-colors active:bg-secondary"
          >
            <PiLinkedinLogoFill />
          </a>
          <a
            href="mailto:azharisworking@gmail.com"
            aria-label="Email"
            className="grid h-10 w-10 place-items-center rounded-md transition-colors active:bg-secondary"
          >
            <PiEnvelopeSimple />
          </a>
        </div>
      </section>

      {/* about / timeline */}
      <Section id="about" title="The journey">
        <ol className="relative border-l-2 border-paper-line pl-6">
          {TIMELINE.map((t, i) => (
            <motion.li
              key={t.year}
              {...reveal(i * 0.05)}
              className="relative mb-5"
            >
              <span className="absolute -left-[30px] top-1.5 h-2.5 w-2.5 rounded-full bg-orange ring-4 ring-paper" />
              <div className="font-mono text-xs text-orange">{t.year}</div>
              <div className="font-semibold text-olive-dark">{t.title}</div>
              <div className="text-sm text-ink-soft">{t.detail}</div>
            </motion.li>
          ))}
        </ol>
        <dl className="mt-2">
          {VALUES.map((v) => (
            <div key={v.k} className="border-t border-paper-line py-3">
              <dt className="font-semibold text-olive-dark">{v.k}</dt>
              <dd className="mt-0.5 text-sm text-ink-soft">{v.v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* skills */}
      <Section id="skills" title="Skills & tools">
        <div className="space-y-7">
          {SKILL_GROUPS.map((g) => (
            <div key={g.title}>
              <div className="mb-3 flex items-baseline justify-between border-b border-paper-line pb-2">
                <h3 className="font-semibold text-olive-dark">{g.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {g.skills.map((s, i) => (
                  <li key={s.name}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium">{s.name}</span>
                      <span className="tabular font-mono text-xs text-ink-soft">
                        {s.years} {s.years === 1 ? "yr" : "yrs"}
                      </span>
                    </div>
                    <SkillMeter level={s.level} delay={i * 0.04} inView />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* services */}
      <Section id="services" title="What I can build">
        <ol className="border-b border-paper-line">
          {SERVICES.map((s, i) => (
            <motion.li
              key={s.title}
              {...reveal(i * 0.04)}
              className="border-t border-paper-line py-4"
            >
              <div>
                <h3 className="font-semibold text-olive-dark">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{s.desc}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </Section>

      {/* resume */}
      <Section id="resume" title="Experience">
        <div className="rounded-lg border border-paper-line bg-card p-4">
          <p className="text-sm leading-relaxed text-ink-soft">
            Full-stack developer with 3 years of experience building web and mobile interfaces. I
            specialize in React, Next.js, and TypeScript with a strong eye for UX, animation, and
            performance.
          </p>
          <div className="mt-4 space-y-4">
            {EXPERIENCE.map((e) => (
              <div key={e.role} className="border-l-2 border-orange/50 pl-3">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-semibold text-olive-dark">{e.role}</div>
                  <div className="shrink-0 font-mono text-[11px] text-ink-soft">{e.date}</div>
                </div>
                <div className="text-xs text-ink-soft">{e.org}</div>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-ink">
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-paper-line pt-3">
            <div className="text-sm font-semibold text-olive-dark">Education</div>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <div className="text-sm text-ink">BS in Computer Science</div>
              <div className="font-mono text-[11px] text-ink-soft">2020 — 2024</div>
            </div>
          </div>
          <button
            onClick={downloadVCard}
            className="btn-secondary mt-4 h-11 w-full px-4 text-sm"
          >
            <PiDownloadSimple /> Download vCard
          </button>
        </div>
      </Section>

      {/* contact */}
      <ContactSection />
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-14 px-5 py-10">
      <motion.h2
        {...reveal()}
        className="mb-5 text-xl font-semibold tracking-tight text-olive-dark"
      >
        {title}
      </motion.h2>
      {children}
    </section>
  );
}

/* ============================ Contact ============================ */

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "bd4a3a0a-b47b-4984-be76-81f284a36b84",
          subject: form.subject || `New message from ${form.name}`,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section id="contact" className="scroll-mt-14 px-5 py-7">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-olive-dark">Let's talk</h2>
        <p className="mt-1 text-sm text-ink-soft">I usually reply within a day.</p>
      </div>

      <ul className="mb-4 space-y-2 rounded-lg border border-paper-line bg-card p-4 text-sm">
        <li>
          <a
            href="mailto:azharisworking@gmail.com"
            className="flex items-center gap-2.5 hover:underline"
          >
            <PiEnvelopeSimple className="text-orange" /> azharisworking@gmail.com
          </a>
        </li>
        <li className="flex items-center gap-2.5">
          <PiPhone className="text-orange" /> +92 329 8892016
        </li>
        <li className="flex items-center gap-2.5">
          <PiMapPin className="text-orange" /> Bahawalpur, Pakistan
        </li>
        <li className="flex gap-4 pt-1 text-lg text-ink-soft">
          <a
            href="https://github.com/azhar0i0"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <PiGithubLogoFill />
          </a>
          <a
            href="https://www.linkedin.com/in/skibidi-azhar"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <PiLinkedinLogoFill />
          </a>
        </li>
      </ul>

      <form onSubmit={submit} className="space-y-3">
        <Field label="Name">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
            placeholder="Your name"
          />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputCls}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Message">
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`${inputCls} resize-none`}
            placeholder="Tell me about your project…"
          />
        </Field>
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary h-11 w-full px-4 text-sm"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "success" && (
          <div role="status" className="rounded-md border border-online/40 bg-online/10 p-2 text-center text-xs text-ink">
            Message sent. I usually reply within a day.
          </div>
        )}
        {status === "error" && (
          <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-center text-xs text-destructive">
            The message didn't send. Try again, or email azharisworking@gmail.com directly.
          </div>
        )}
      </form>
    </section>
  );
}

const inputCls =
  "w-full rounded-md border border-paper-line bg-paper px-3 py-2 text-sm outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/20";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </span>
      {children}
    </label>
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
