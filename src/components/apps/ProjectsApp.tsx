import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PiArrowUpRight, PiX, PiMagnifyingGlass, PiImageSquare } from "react-icons/pi";
import { EASE_SPRING } from "@/lib/motion";
import { loadProjects, readCachedProjects, type Project } from "@/lib/projects";

export function ProjectsApp() {
  const [repos, setRepos] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);
  const [dashRepo, setDashRepo] = useState<Project | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      // Show what this browser saved last time right away, then refresh.
      const cached = readCachedProjects();
      if (cached) {
        setRepos(cached);
        setLoading(false);
      }
      try {
        const projects = await loadProjects();
        if (alive) setRepos(projects);
      } catch (e) {
        if (alive && !cached) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(
    () =>
      repos.filter((r) =>
        (r.name + " " + (r.desc ?? "") + " " + r.topics.join(" "))
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [repos, search],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 border-b border-paper-line bg-secondary/60 px-4 py-3">
        <div>
          <h1 className="font-semibold text-olive-dark">Projects</h1>
          <p className="text-xs text-ink-soft">Selected work, newest first</p>
        </div>
        <div className="relative ml-auto md:w-56 w-full">
          <PiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-ink-soft" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="md:w-56 w-full rounded-md border border-paper-line bg-paper py-1.5 pl-8 pr-3 text-sm outline-none focus:border-orange"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {loading && <GridSkeleton />}
        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            Couldn't fetch projects: {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="py-16 text-center text-ink-soft">
            No projects found.
          </div>
        )}
        <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {filtered.map((r, i) => (
            <motion.article
              key={r.name}
              // Animate on load, not on scroll: cards live in the window's own
              // scroll area, where in-view detection can miss the last row.
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_SPRING, delay: Math.min(i, 8) * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelected(r)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(r);
                }
              }}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-paper-line bg-card shadow-md outline-none hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-orange"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                <Thumb
                  project={r}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  fallbackClassName="h-full w-full"
                />
                <Badges repo={r} />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold text-olive-dark">{r.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
                  {r.desc ?? "No description provided."}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {r.topics.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="tag"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-paper-line pt-3 text-xs text-ink-soft">
                  <span className="inline-flex items-center gap-1 font-medium text-orange">
                    View details <PiArrowUpRight className="text-[11px]" />
                  </span>
                  <span className="ml-auto font-mono text-[10px]">
                    {new Date(r.created).getFullYear()}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectDetail
            repo={selected}
            onClose={() => setSelected(null)}
            onVisit={() => {
              if (selected.isDashboard) setDashRepo(selected);
              else window.open(selected.url, "_blank");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dashRepo && <DashboardAlert repo={dashRepo} onClose={() => setDashRepo(null)} />}
      </AnimatePresence>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-lg border border-paper-line bg-card">
          <div className="aspect-[16/10] bg-secondary" />
          <div className="flex flex-col p-4">
            <div className="h-4 w-2/3 rounded bg-secondary" />
            <div className="mt-2 h-3 w-full rounded bg-secondary" />
            <div className="mt-1.5 h-3 w-5/6 rounded bg-secondary" />
            <div className="mt-3 flex gap-1">
              <div className="h-4 w-12 rounded-full bg-secondary" />
              <div className="h-4 w-14 rounded-full bg-secondary" />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-paper-line pt-3">
              <div className="h-3 w-20 rounded bg-secondary" />
              <div className="h-3 w-8 rounded bg-secondary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Shows a "no preview" panel when the sheet has no image link or the link
// doesn't load.
function Thumb({
  project,
  className,
  fallbackClassName,
  large = false,
}: {
  project: Project;
  className: string;
  fallbackClassName: string;
  large?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!project.image || failed) {
    return (
      <div
        role="img"
        aria-label={`No preview available for ${project.name}`}
        className={`${fallbackClassName} flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-olive-light/25 via-secondary to-orange/10`}
      >
        <span
          className={`grid place-items-center rounded-lg border border-dashed border-olive-dark/30 bg-paper/70 text-olive-dark/70 ${large ? "h-14 w-14 text-3xl" : "h-11 w-11 text-2xl"}`}
        >
          <PiImageSquare />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          No preview available
        </span>
      </div>
    );
  }
  return (
    <img
      src={project.image}
      alt={project.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

function Badges({ repo }: { repo: Project }) {
  if (!repo.featured && !repo.isDashboard) return null;
  return (
    <div className="absolute left-2 top-2 flex gap-1">
      {repo.featured && (
        <span className="rounded-[2px] bg-orange px-1.5 py-0.5 font-mono text-[10px] text-paper">featured</span>
      )}
      {repo.isDashboard && (
        <span className="rounded-[2px] bg-[var(--chrome)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--chrome-fg)]">
          dashboard
        </span>
      )}
    </div>
  );
}

function ProjectDetail({
  repo,
  onClose,
  onVisit,
}: {
  repo: Project;
  onClose: () => void;
  onVisit: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88%] w-full max-w-md flex-col overflow-hidden rounded-xl border border-paper-line bg-card window-shadow"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-paper-line bg-olive-dark px-3 py-1.5 text-paper">
          <div className="truncate font-mono text-[11px]">
            C:\AzharAli\Projects\{repo.name}
          </div>
          <button
            onClick={onClose}
            className="ml-2 shrink-0 rounded p-1 text-paper/70 transition hover:bg-paper/10 hover:text-paper"
          >
            <PiX className="text-xs" />
          </button>
        </div>

        <div className="relative aspect-[2/1] shrink-0 overflow-hidden border-b border-paper-line bg-secondary">
          <Thumb
            project={repo}
            className="absolute inset-0 h-full w-full object-cover object-top"
            fallbackClassName="absolute inset-0"
            large
          />
          <Badges repo={repo} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <div className="flex items-center justify-between gap-2">
            <h2 className="truncate text-base font-semibold text-olive-dark">{repo.name}</h2>
            <span className="shrink-0 font-mono text-[11px] text-ink-soft">
              {new Date(repo.created).getFullYear()}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
            {repo.desc ?? "No description provided."}
          </p>

          {repo.topics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {repo.topics.map((t) => (
                <span
                  key={t}
                  className="tag"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 border-t border-paper-line pt-3">
            <button
              onClick={onVisit}
              className="btn-primary h-8 w-full px-3 text-xs"
            >
              Visit site <PiArrowUpRight />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DashboardAlert({ repo, onClose }: { repo: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-xl border border-paper-line bg-card window-shadow"
      >
        <div className="flex items-center justify-between border-b border-paper-line bg-olive-dark px-4 py-2 text-paper">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-orange" />
            Dashboard access
          </div>
          <button onClick={onClose} aria-label="Close" className="text-paper/80 transition hover:text-paper">
            <PiX />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <div className="text-sm font-semibold text-olive-dark">{repo.name}</div>
            <div className="text-xs text-ink-soft">Use these demo credentials to log in:</div>
          </div>
          <dl className="space-y-2 rounded-lg border border-paper-line bg-paper p-3 font-mono text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-soft">email</dt>
              <dd className="font-medium">{repo.dashEmail}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-soft">password</dt>
              <dd className="font-medium">{repo.dashPassword}</dd>
            </div>
          </dl>
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="btn-primary h-10 w-full px-5 text-sm"
          >
            Visit site <PiArrowUpRight />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
