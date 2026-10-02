import { createServerFn } from "@tanstack/react-start";

export type Project = {
  name: string;
  desc: string | null;
  url: string;
  image: string | null;
  topics: string[];
  created: string;
  isDashboard: boolean;
  featured: boolean;
  dashEmail: string;
  dashPassword: string;
};

// Projects live in a public Google Sheet ("Projects" tab); row 1 holds the column keys.
const SHEET_ID = "1RmhdC9BRh3ueJExyrD2ZCg8WAkodpmFQHvx8bj24D8E";
const SHEET_CSV = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Projects`;
// v2: lists saved before image links were resolved held unusable ImgBB page URLs.
const CACHE_KEY = "azhar.projects.v2";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/**
 * Turns common "share" links into direct image URLs. Pure string rewrites, so
 * it runs anywhere; ImgBB page links need a fetch and are handled on the server.
 */
function directImageUrl(url: string): string {
  const drive = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
  if (drive) return `https://lh3.googleusercontent.com/d/${drive[1]}`;
  if (/^https?:\/\/(www\.)?dropbox\.com\//.test(url)) {
    const u = new URL(url);
    u.searchParams.delete("dl");
    u.searchParams.set("raw", "1");
    return u.toString();
  }
  return url;
}

// ImgBB viewer pages (ibb.co/xxxx) are HTML; the real file is in og:image.
// Resolved links never change, so they're kept for the life of the server instance.
const ibbCache = new Map<string, string>();
async function resolveImgbbPage(url: string): Promise<string> {
  if (!/^https?:\/\/(www\.)?ibb\.co\/\w+\/?$/.test(url)) return url;
  const hit = ibbCache.get(url);
  if (hit) return hit;
  try {
    const html = await (await fetch(url)).text();
    const direct = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    if (direct) {
      ibbCache.set(url, direct);
      return direct;
    }
  } catch {
    // Leave the original; the card shows the "no preview" state if it can't load.
  }
  return url;
}

async function fetchSheet(): Promise<Project[]> {
  const res = await fetch(SHEET_CSV);
  if (!res.ok) throw new Error(`Sheet ${res.status}`);
  return toProjects(await res.text());
}

// Runs on the server so it can read ImgBB pages (no CORS for the browser).
const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  const projects = await fetchSheet();
  return Promise.all(
    projects.map(async (p) => (p.image ? { ...p, image: await resolveImgbbPage(p.image) } : p)),
  );
});

async function fetchProjects(): Promise<Project[]> {
  try {
    return await getProjects();
  } catch {
    // Server function unavailable: read the sheet straight from the browser.
    return fetchSheet();
  }
}

function toProjects(csv: string): Project[] {
  const [head = [], ...body] = parseCsv(csv);
  const keys = head.map((h) => h.trim().toLowerCase());
  return body
    .map((cells) => Object.fromEntries(keys.map((k, i) => [k, (cells[i] ?? "").trim()])))
    .filter((r) => r.name && r.visible?.toUpperCase() !== "FALSE")
    .map((r) => ({
      name: r.name,
      desc: r.description || null,
      url: r.live_url,
      image: r.image_url ? directImageUrl(r.image_url) : null,
      topics: (r.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      created: r.created,
      isDashboard: r.type?.toLowerCase() === "dashboard",
      featured: r.featured?.toUpperCase() === "TRUE",
      dashEmail: r.dashboard_email || "admin@company.com",
      dashPassword: r.dashboard_password || "admin.me",
    }))
    .sort((a, b) => +b.featured - +a.featured || +new Date(b.created) - +new Date(a.created));
}

/** Last list saved in this browser, or null (first visit, private mode, blocked storage). */
export function readCachedProjects(): Project[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed?.projects) ? parsed.projects : null;
  } catch {
    return null;
  }
}

let inflight: Promise<Project[]> | null = null;

/**
 * Fetches the sheet once per page load and saves it to localStorage. Called
 * from the boot screen so the list (and its images) are warm before the
 * Projects window opens; later callers share the same request.
 */
export function loadProjects(): Promise<Project[]> {
  inflight ??= fetchProjects()
    .then((projects) => {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), projects }));
      } catch {
        // Storage full or blocked; the in-memory result still works.
      }
      // Warm the browser cache so thumbnails appear instantly.
      projects.forEach((p) => { if (p.image) new Image().src = p.image; });
      return projects;
    })
    .catch((e) => {
      inflight = null; // allow a retry next time
      throw e;
    });
  return inflight;
}
