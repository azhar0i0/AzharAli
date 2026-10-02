import { PiEnvelopeSimple, PiGithubLogoFill, PiLinkedinLogoFill, PiMapPin, PiPhone } from "react-icons/pi";

export function ResumeApp() {
  return (
    <div className="h-full overflow-y-auto bg-paper p-8 scrollbar-thin">
      <div className="mx-auto max-w-2xl">
        <header className="border-b-2 border-olive-dark pb-4">
          <h1 className="font-display text-5xl leading-none tracking-tight text-olive-dark">Azhar Ali</h1>
          <p className="mt-1 text-sm text-ink-soft">Full-stack developer · React / Next.js</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
            <span className="flex items-center gap-1"><PiEnvelopeSimple /> azharisworking@gmail.com</span>
            <span className="flex items-center gap-1"><PiPhone /> +92 329 8892016</span>
            <span className="flex items-center gap-1"><PiMapPin /> Bahawalpur, Pakistan</span>
            <span className="flex items-center gap-1"><PiGithubLogoFill /> azhar0i0</span>
            <span className="flex items-center gap-1"><PiLinkedinLogoFill /> skibidi-azhar</span>
          </div>
        </header>

        <Section title="Summary">
          <p className="text-sm leading-relaxed">
            Full-stack developer with 3 years of experience building web and mobile
            interfaces. I specialize in React, Next.js, and TypeScript with a strong
            eye for UX, animation, and performance.
          </p>
        </Section>

        <Section title="Experience">
          <Entry
            role="Freelance Full-Stack Developer"
            org="Self-employed"
            date="2024 — Present"
            bullets={[
              "Design & ship React/Next.js applications for clients globally.",
              "Build dashboards, e-commerce sites, and management systems.",
              "Own product from Figma to deploy on Vercel/Netlify.",
            ]}
          />
          <Entry
            role="Frontend Developer"
            org="Contract"
            date="2023 — 2024"
            bullets={[
              "Built animated marketing sites with Framer Motion & GSAP.",
              "Set up reusable design systems on top of Tailwind CSS.",
            ]}
          />
        </Section>

        <Section title="Projects">
          <Entry role="Shop Buddy" org="Expense management system" date="" bullets={["React + Node stack, JWT auth, receipt uploads."]} />
          <Entry role="E-Commerce Website" org="Modern shopping platform" date="" bullets={["Filters, auth, payments integration."]} />
          <Entry role="Portfolio Website" org="Interactive OS-style portfolio" date="" bullets={["This one — window manager, terminal, GitHub API."]} />
        </Section>

        <Section title="Education">
          <Entry role="BS in Computer Science" org="Pakistan" date="2020 — 2024" />
        </Section>

        <Section title="Skills">
          <p className="text-sm">
            React, Next.js, TypeScript, JavaScript, Tailwind, Framer Motion, Redux,
            Node.js, Express, Supabase, Firebase, Django, WordPress, MongoDB, PostgreSQL, MySQL,
            Git, Figma.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Entry({ role, org, date, bullets }: { role: string; org: string; date: string; bullets?: string[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <div className="font-semibold text-olive-dark">{role}</div>
          <div className="text-xs text-ink-soft">{org}</div>
        </div>
        {date && <div className="tabular shrink-0 font-mono text-xs text-ink-soft">{date}</div>}
      </div>
      {bullets && (
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-ink">
          {bullets.map((b) => <li key={b}>{b}</li>)}
        </ul>
      )}
    </div>
  );
}
