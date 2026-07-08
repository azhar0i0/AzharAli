import { motion } from "framer-motion";

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
    <div className="h-full overflow-y-auto p-6 scrollbar-thin">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
          Toolbox
        </div>
        <h1 className="text-2xl font-bold text-olive-dark">Skills & Tech</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {GROUPS.map((g) => (
          <div
            key={g.title}
            className="rounded-lg border border-paper-line bg-card p-4"
          >
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-semibold text-olive-dark">{g.title}</h2>
              <span className="font-mono text-xs text-ink-soft">
                {g.skills.length} items
              </span>
            </div>
            <ul className="space-y-3">
              {g.skills.map((s, i) => (
                <li key={s.name}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="font-mono text-xs text-ink-soft">
                      {s.years}y
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-paper">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.level}%` }}
                      transition={{ delay: i * 0.06, duration: 0.7, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-orange to-orange-soft"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
