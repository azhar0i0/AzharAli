import { motion } from "framer-motion";
import { FaCode, FaMobile, FaServer, FaPalette, FaBolt } from "react-icons/fa";
import type { ReactNode } from "react";

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
    desc: "APIs, authentication, databases, real-time — all the plumbing that keeps apps alive.",
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
    tags: ["Lighthouse", "Animations"],
  },
];

export function ServicesApp() {
  return (
    <div className="h-full overflow-y-auto p-6 scrollbar-thin">
      <div className="mb-5">
        <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">Menu</div>
        <h1 className="text-2xl font-bold text-olive-dark">Services</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            className="rounded-lg border border-paper-line bg-card p-4 window-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-orange/15 text-orange">
                {s.icon}
              </span>
              <h2 className="font-semibold text-olive-dark">{s.title}</h2>
            </div>
            <p className="mt-3 text-sm text-ink-soft">{s.desc}</p>
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
    </div>
  );
}
