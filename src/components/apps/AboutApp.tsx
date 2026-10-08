import { motion } from "framer-motion";
import { PopAvatar } from "@/components/PopAvatar";
import { reveal } from "@/lib/motion";

const TIMELINE = [
  { year: "2026", title: "DevOps & AI Developer", detail: "Exploring the intersection of DevOps practices and AI technologies." },
  { year: "2025", title: "Backend Developer", detail: "Working & learning on Node.js or Express concepts." },
  { year: "2024", title: "Front-End Developer", detail: "Shipping React/Next.js (pwa) apps for clients globally & advancing javascript skills." },
  { year: "2023", title: "Started learning Development", detail: "Focused on javascript basics, fundamentals & practice them." },
  // { year: "2022", title: "Started Web Development", detail: "Fell in love with React and modern UI engineering." },
];

const VALUES = [
  { k: "Craft", v: "Pixel-perfect UI with attention to motion & detail." },
  { k: "Clarity", v: "Clean architecture, readable code, honest docs." },
  { k: "Curiosity", v: "Always exploring new tools, patterns, and ideas." },
  { k: "Impact", v: "Ship things that solve real problems for real people." },
];

export function AboutApp() {
  return (
    <div className="h-full overflow-y-auto px-8 pb-10 pt-8 scrollbar-thin">
      <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-start md:text-left">
        <PopAvatar size={80} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-olive-dark">
            Hi, I'm Azhar
          </h1>
          <p className="mt-3 max-w-[60ch] leading-relaxed text-ink">
            A full-stack developer based in Pakistan with about 3 years spent
            building web and app interfaces. I enjoy creating polished user
            experiences while writing maintainable backend systems.
          </p>
        </div>
      </div>

      <section className="mt-10">
        <SectionTitle>Timeline</SectionTitle>
        <ol className="relative border-l-2 border-paper-line pl-6">
          {TIMELINE.map((t, i) => (
            <motion.li
              key={t.year}
              {...reveal(i * 0.05)}
              className="relative mb-5"
            >
              <span className="absolute -left-[30px] top-1.5 h-2.5 w-2.5 rounded-full bg-orange ring-4 ring-card" />
              <time className="font-mono text-xs text-orange">{t.year}</time>
              <div className="font-semibold text-olive-dark">{t.title}</div>
              <div className="text-sm text-ink-soft">{t.detail}</div>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <SectionTitle>What I value</SectionTitle>
        <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.k}
              {...reveal(i * 0.04)}
              className="border-t border-paper-line py-4"
            >
              <dt className="font-semibold text-olive-dark">{v.k}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{v.v}</dd>
            </motion.div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-3 text-sm font-semibold text-olive-dark">
      {children}
      <span className="h-px flex-1 bg-paper-line" />
    </h2>
  );
}
