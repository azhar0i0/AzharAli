import { motion } from "framer-motion";
import { SkillMeter } from "./SkillMeter";
import { reveal } from "@/lib/motion";

type Skill = { name: string; years: number; level: number };
const GROUPS: { title: string; skills: Skill[] }[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", years: 2, level: 92 },
      { name: "Next.js", years: 2, level: 88 },
      { name: "TypeScript", years: 2, level: 85 },
      { name: "JavaScript", years: 3, level: 94 },
      { name: "Tailwind CSS", years: 2, level: 95 },
      { name: "Redux", years: 2, level: 80 },
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
      { name: "VS Code", years: 3, level: 95 },
      { name: "Figma", years: 2, level: 78 },
      { name: "Canva", years: 2, level: 82 },
    ],
  },
];

export function SkillsApp() {
  return (
    <div className="h-full overflow-y-auto px-8 pb-10 pt-8 scrollbar-thin">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-olive-dark">Skills &amp; tools</h1>
        <p className="mt-1 text-sm text-ink-soft">Years of hands-on use, with a rough sense of depth.</p>
      </header>
      <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
        {GROUPS.map((g, gi) => (
          <motion.section key={g.title} {...reveal(gi * 0.05)}>
            <div className="mb-3 flex items-baseline justify-between border-b border-paper-line pb-2">
              <h2 className="font-semibold text-olive-dark">{g.title}</h2>
            </div>
            <ul className="space-y-3">
              {g.skills.map((s, i) => (
                <li key={s.name}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="tabular font-mono text-xs text-ink-soft">
                      {s.years} {s.years === 1 ? "yr" : "yrs"}
                    </span>
                  </div>
                  <SkillMeter level={s.level} delay={gi * 0.08 + i * 0.04} />
                </li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
