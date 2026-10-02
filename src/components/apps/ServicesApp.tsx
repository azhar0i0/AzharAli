import { motion } from "framer-motion";
import { reveal } from "@/lib/motion";

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
    desc: "APIs, authentication, databases, real-time — all the plumbing that keeps apps alive.",
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
    tags: ["Lighthouse", "Animations"],
  },
  {
    title: "SaaS, e-commerce & POS",
    desc: "Subscription products, online stores and point-of-sale systems, from data model to checkout.",
    tags: ["React", "Next.js", "Node.js", "Express"],
  },
];

export function ServicesApp() {
  return (
    <div className="@container h-full overflow-y-auto px-8 pb-10 pt-8 scrollbar-thin">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-olive-dark">Services</h1>
        <p className="mt-1 text-sm text-ink-soft">What I can build for you, from first sketch to production.</p>
      </header>
      <ul className="max-w-5xl border-b border-paper-line">
        {SERVICES.map((s, i) => (
          <motion.li
            key={s.title}
            {...reveal(i * 0.04)}
            className="grid grid-cols-1 gap-x-8 gap-y-2 border-t border-paper-line py-5 @2xl:grid-cols-[14rem_1fr]"
          >
            <h2 className="font-semibold leading-snug text-olive-dark">
              {s.title}
            </h2>
            <div>
              <p className="max-w-[55ch] text-sm leading-relaxed text-ink-soft">{s.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
