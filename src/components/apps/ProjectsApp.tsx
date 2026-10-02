import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PiGithubLogoFill, PiArrowUpRight, PiX, PiMagnifyingGlass } from "react-icons/pi";
import { EASE_SPRING } from "@/lib/motion";

type Repo = {
  name: string;
  desc: string | null;
  url: string;
  homepage: string | null;
  image: string | null;
  topics: string[];
  created: string;
  isDashboard: boolean;
};

// Repos without a preview.png log a 404 here; that's expected and harmless,
// the card just falls back to the initials placeholder.
async function fetchRepoImage(username: string, repo: string, branch: string) {
  const url = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/preview.png`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok ? url : null;
  } catch {
    return null;
  }
}

export function ProjectsApp() {
  const username = "azhar0i0";
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Repo | null>(null);
  const [dashRepo, setDashRepo] = useState<Repo | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=created&direction=desc`,
          { headers: { Accept: "application/vnd.github.mercy-preview+json" } },
        );
        if (!res.ok) throw new Error(`GitHub ${res.status}`);
        const data: Array<{
          name: string; description: string | null; html_url: string;
          homepage: string | null; topics?: string[]; created_at: string;
          default_branch: string;
        }> = await res.json();
        const filtered = data.filter(
          (r) => r.topics?.includes("portfolio-project") || r.topics?.includes("dashboard"),
        );
        filtered.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
        const withImages = await Promise.all(
          filtered.map(async (r) => ({
            name: r.name,
            desc: r.description,
            url: r.homepage || r.html_url,
            homepage: r.homepage,
            image: await fetchRepoImage(username, r.name, r.default_branch || "main"),
            // Hide the selector topics; they're for filtering, not for visitors.
            topics: (r.topics ?? []).filter((t) => t !== "portfolio-project" && t !== "dashboard"),
            created: r.created_at,
            isDashboard: (r.topics ?? []).includes("dashboard"),
          })),
        );
        if (alive) setRepos(withImages);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load");
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
          <p className="text-xs text-ink-soft">Pulled live from GitHub</p>
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
            No projects found. Add the <code className="rounded bg-secondary px-1">portfolio-project</code> or <code className="rounded bg-secondary px-1">dashboard</code> topic to your repos.
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
                {r.image ? (
                  <img
                    src={r.image}
                    alt={r.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-olive-light/40 to-orange/20 font-mono text-3xl text-olive-dark">
                    {r.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                {r.isDashboard && (
                  <span className="absolute left-2 top-2 rounded-[2px] bg-[var(--chrome)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--chrome-fg)]">
                    dashboard
                  </span>
                )}
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
            username={username}
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

function ProjectDetail({
  repo,
  username,
  onClose,
  onVisit,
}: {
  repo: Repo;
  username: string;
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
          {repo.image ? (
            <img
              src={repo.image}
              alt={repo.name}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-olive-light/40 to-orange/20 font-mono text-4xl text-olive-dark">
              {repo.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          {repo.isDashboard && (
            <span className="absolute left-2 top-2 rounded-[2px] bg-[var(--chrome)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--chrome-fg)]">
              dashboard
            </span>
          )}
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

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-paper-line pt-3">
            <a
              href={`https://github.com/${username}/${repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary h-8 px-3 text-xs"
            >
              <PiGithubLogoFill /> Code
            </a>
            <button
              onClick={onVisit}
              className="btn-primary h-8 px-3 text-xs"
            >
              Visit site <PiArrowUpRight />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DashboardAlert({ repo, onClose }: { repo: Repo; onClose: () => void }) {
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
              <dd className="font-medium">admin@company.com</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-soft">password</dt>
              <dd className="font-medium">admin.me</dd>
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
