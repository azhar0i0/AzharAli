import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaFolderOpen,
  FaCode,
  FaMobile,
  FaServer,
  FaPalette,
  FaBolt,
  FaFileDownload,
} from "react-icons/fa";
import type { ReactNode } from "react";
import avatar from "@/assets/avatar.jpg";
import { getTheme, THEMES, useSettingsStore } from "@/lib/desktop/store";

const THEME_CLASSES = THEMES.map((t) => `theme-${t.id}`);
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { BootScreen } from "@/components/desktop/BootScreen";

/* ============================ data ============================ */

const ROLES = [
  "React Developer",
  "Next.js Developer",
  "Full Stack Developer",
  "Frontend Engineer",
  "Backend Engineer",
];

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

const SERVICES: { icon: ReactNode; title: string; desc: string; tags: string[] }[] = [
  {
    icon: <FaCode />,
    title: "Web Development",
    desc: "Modern, fast, accessible websites and web apps built with the React ecosystem.",
    tags: ["React", "Next.js", "Tailwind"],
  },
  {
    icon: <FaMobile />,
    title: "App Development",
    desc: "Cross-platform mobile experiences that feel native on iOS and Android.",
    tags: ["React Native"],
  },
  {
    icon: <FaServer />,
    title: "Backend Development",
    desc: "APIs, auth, databases, real-time — all the plumbing that keeps apps alive.",
    tags: ["Node.js", "Django", "Firebase"],
  },
  {
    icon: <FaPalette />,
    title: "UI Design",
    desc: "Design systems and interfaces that look great and stay consistent as you scale.",
    tags: ["Figma"],
  },
  {
    icon: <FaBolt />,
    title: "Performance & SEO",
    desc: "Squeezing every millisecond out of your app + technical SEO that ranks.",
    tags: ["Lighthouse"],
  },
  {
    icon: <FaBolt />,
    title: "SaaS / E-commerce / POS",
    desc: "Building SaaS, e-commerce and POS apps with a modern stack and best practices.",
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

function useTyping(words: string[]) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[i];
    const speed = deleting ? 40 : 80;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) setTimeout(() => setDeleting(true), 1400);
      } else {
        const next = word.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setI((v) => (v + 1) % words.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, i, words]);
  return text;
}

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
      <div className="pointer-events-none fixed inset-0 z-[60] opacity-[0.04] [background:repeating-linear-gradient(to_bottom,#000_0px,#000_1px,transparent_1px,transparent_3px)]" />

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
        <span className="ml-auto grid h-5 w-5 place-items-center rounded-sm bg-orange text-[11px] font-bold text-white">
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
          icon={<FaUser />}
          label="Me"
        />
        <TabButton
          active={tab === "work"}
          onClick={() => setTab("work")}
          icon={<FaFolderOpen />}
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
      className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition ${
        active ? "text-white" : "text-paper/60"
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
  const typed = useTyping(ROLES);

  return (
    <div className="pb-10">
      {/* hero */}
      <section className="relative overflow-hidden border-b border-paper-line bg-card px-5 pb-8 pt-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange/15 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-full bg-orange/30 blur-md" />
            <img
              src={avatar}
              alt="Azhar Ali"
              width={88}
              height={88}
              className="relative h-22 w-22 rounded-full border-2 border-olive-dark object-cover"
            />
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-paper bg-green-500" />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
              &gt; who am i
            </div>
            <h1 className="mt-0.5 text-3xl font-bold tracking-tight text-olive-dark">Azhar Ali</h1>
            <div className="mt-1 h-6 font-mono text-sm text-orange">
              {typed}
              <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-orange" />
            </div>
          </div>
        </div>

        <p className="relative mt-5 leading-relaxed text-ink">
          I create beautiful, functional, and user-centered digital experiences. Over 3 years of
          building web and mobile products — turning ideas into elegant, scalable applications with
          modern tech and thoughtful design.
        </p>

        <div className="relative mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-paper-line bg-paper p-3">
            <div className="flex items-center gap-2 text-ink-soft">
              <FaMapMarkerAlt /> Location
            </div>
            <div className="mt-1 font-medium">Bahawalpur, PK</div>
          </div>
          <div className="rounded-md border border-paper-line bg-paper p-3">
            <div className="flex items-center gap-2 text-ink-soft">
              <span className="h-2 w-2 rounded-full bg-green-500" /> Status
            </div>
            <div className="mt-1 font-medium">Open to work</div>
          </div>
        </div>

        <div className="relative mt-5 flex gap-3">
          <button
            onClick={onContact}
            className="flex-1 rounded-md bg-orange px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_0_#c56e17] transition active:translate-y-0.5"
          >
            Hire Me
          </button>
          <button
            onClick={onResume}
            className="flex-1 rounded-md border border-olive-dark bg-paper px-4 py-2.5 text-sm font-semibold text-olive-dark transition active:translate-y-0.5"
          >
            View Resume
          </button>
        </div>

        <div className="relative mt-5 flex items-center gap-5 border-t border-paper-line pt-4 text-xl text-ink-soft">
          <a
            href="https://github.com/azhar0i0"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/skibidi-azhar"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a href="mailto:azharisworking@gmail.com" aria-label="Email">
            <FaEnvelope />
          </a>
        </div>
      </section>

      {/* about / timeline */}
      <Section id="about" eyebrow="about" title="The journey">
        <ol className="relative border-l-2 border-paper-line pl-6">
          {TIMELINE.map((t, i) => (
            <motion.li
              key={t.year}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="mb-5"
            >
              <span className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-orange bg-paper" />
              <div className="font-mono text-xs text-orange">{t.year}</div>
              <div className="font-semibold text-olive-dark">{t.title}</div>
              <div className="text-sm text-ink-soft">{t.detail}</div>
            </motion.li>
          ))}
        </ol>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {VALUES.map((v) => (
            <div key={v.k} className="rounded-md border border-paper-line bg-card p-3">
              <div className="font-semibold text-olive-dark">{v.k}</div>
              <div className="mt-1 text-xs text-ink-soft">{v.v}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* skills */}
      <Section id="skills" eyebrow="toolbox" title="Skills & Tech">
        <div className="space-y-4">
          {SKILL_GROUPS.map((g) => (
            <div key={g.title} className="rounded-lg border border-paper-line bg-card p-4">
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="font-semibold text-olive-dark">{g.title}</h3>
                <span className="font-mono text-xs text-ink-soft">{g.skills.length} items</span>
              </div>
              <ul className="space-y-2.5">
                {g.skills.map((s, i) => (
                  <li key={s.name}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium">{s.name}</span>
                      <span className="font-mono text-xs text-ink-soft">{s.years}y</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-paper">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.level}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.7, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-orange to-orange-soft"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* services */}
      <Section id="services" eyebrow="menu" title="What I can build">
        <div className="grid grid-cols-1 gap-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-lg border border-paper-line bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-orange/15 text-orange">
                  {s.icon}
                </span>
                <h3 className="font-semibold text-olive-dark">{s.title}</h3>
              </div>
              <p className="mt-2.5 text-sm text-ink-soft">{s.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-ink-soft"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* resume */}
      <Section id="resume" eyebrow="resume" title="Experience">
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
            <div className="font-mono text-xs uppercase tracking-widest text-orange">Education</div>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <div className="font-semibold text-olive-dark">BS in Computer Science</div>
              <div className="font-mono text-[11px] text-ink-soft">2020 — 2024</div>
            </div>
          </div>
          <button
            onClick={downloadVCard}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-olive-dark px-4 py-2.5 text-sm font-semibold text-paper transition active:translate-y-0.5"
          >
            <FaFileDownload /> Download vCard
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
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-14 px-5 py-7">
      <div className="mb-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
          &gt; {eyebrow}
        </div>
        <h2 className="mt-0.5 text-xl font-bold text-olive-dark">{title}</h2>
      </div>
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
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
          &gt; reach out
        </div>
        <h2 className="mt-0.5 text-xl font-bold text-olive-dark">Let's talk</h2>
      </div>

      <ul className="mb-4 space-y-2 rounded-lg border border-paper-line bg-card p-4 text-sm">
        <li>
          <a
            href="mailto:azharisworking@gmail.com"
            className="flex items-center gap-2.5 hover:underline"
          >
            <FaEnvelope className="text-orange" /> azharisworking@gmail.com
          </a>
        </li>
        <li className="flex items-center gap-2.5">
          <FaPhone className="text-orange" /> +92 329 8892016
        </li>
        <li className="flex items-center gap-2.5">
          <FaMapMarkerAlt className="text-orange" /> Bahawalpur, Pakistan
        </li>
        <li className="flex gap-4 pt-1 text-lg text-ink-soft">
          <a
            href="https://github.com/azhar0i0"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/skibidi-azhar"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
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
          className="w-full rounded-md bg-orange px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_0_#c56e17] transition active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>
        {status === "success" && (
          <div className="rounded-md border border-green-500/40 bg-green-500/10 p-2 text-center text-xs text-green-700">
            Message sent — I'll get back to you soon!
          </div>
        )}
        {status === "error" && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-center text-xs text-destructive">
            Something went wrong. Please try again or email me directly.
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
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ink-soft">
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
