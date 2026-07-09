import { motion } from "framer-motion";
import avatar from "@/assets/avatar.jpg";

const TIMELINE = [
  { year: "2026", title: "DevOps & AI Developer", detail: "Exploring the intersection of DevOps practices and AI technologies." },
  { year: "2025", title: "Backend Developer", detail: "Working on Node.js or Express for better performance." },
  { year: "2024", title: "Freelance Full-Stack Developer", detail: "Shipping React/Next.js (pwa) apps for clients globally." },
  { year: "2023", title: "Frontend Developer", detail: "Focused on design systems, animations & performance." },
  { year: "2022", title: "Started Web Development", detail: "Fell in love with React and modern UI engineering." },
];

const VALUES = [
  { k: "Craft", v: "Pixel-perfect UI with attention to motion & detail." },
  { k: "Clarity", v: "Clean architecture, readable code, honest docs." },
  { k: "Curiosity", v: "Always exploring new tools, patterns, and ideas." },
  { k: "Impact", v: "Ship things that solve real problems for real people." },
];

export function AboutApp() {
  return (
    <div className="h-full overflow-y-auto p-8 scrollbar-thin">
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
        <img
          src={avatar}
          alt=""
          width={96}
          height={96}
          className="h-24 w-24 rounded-full border-2 border-olive-dark object-cover"
        />
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">About Me</div>
          <h1 className="mt-1 text-3xl font-bold text-olive-dark">Hi, I'm Azhar</h1>
          <p className="mt-2 max-w-prose text-ink">
            A full-stack developer based in Pakistan with about 3 years spent
            building web and app interfaces. I enjoy creating polished user
            experiences while writing maintainable backend systems.
          </p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-olive-dark">
          Timeline
        </h2>
        <ol className="relative border-l-2 border-paper-line pl-6">
          {TIMELINE.map((t, i) => (
            <motion.li
              key={t.year}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="mb-5"
            >
              <span className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-orange bg-paper" />
              <div className="font-mono text-xs text-orange">{t.year}</div>
              <div className="font-semibold text-olive-dark">{t.title}</div>
              <div className="text-sm text-ink-soft">{t.detail}</div>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-olive-dark">
          What I value
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div
              key={v.k}
              className="rounded-md border border-paper-line bg-card p-3 transition hover:-translate-y-0.5 hover:border-orange"
            >
              <div className="font-semibold text-olive-dark">{v.k}</div>
              <div className="mt-1 text-sm text-ink-soft">{v.v}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
