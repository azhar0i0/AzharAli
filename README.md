<div align="center">

# 🖥️ AzharOS — An Interactive Desktop Portfolio

**A portfolio disguised as a lightweight retro operating system.**

Boot it up, drag the icons, open a terminal, list the projects — then close the
browser tab like it was a whole computer.

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-SSR-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/start)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/workers/)

![AzharOS preview](./showcase.png)

</div>

---

## 🌐 Live

- **Preview:** open the deployed URL and wait for the boot sequence.
- **Local:** `npm install && npm run dev` — then visit **http://localhost:8080**.

---

## ✨ Why this exists

Most developer portfolios are a scroll and a hero. This one is a **desktop you
can actually use** — windows, a taskbar, a Start menu, a working terminal,
right-click menus, wallpapers, keyboard shortcuts, and a fake `C:\AzharAli`
filesystem where every file opens the app that owns it.

It's a résumé, a play space, and a technical demo — all rendered in one screen.

---

## 🎯 Feature tour

| Area | What's inside |
| ---- | ------------- |
| 🚀 **Boot** | Cold-boot animation before the desktop appears |
| 🖱️ **Desktop** | Draggable, grid-snapping icons over a parallax wallpaper |
| 🪟 **Windows** | Drag / resize / minimize / maximize / focus stacking, `react-rnd` powered |
| 📊 **Taskbar** | Live clock, running-window list, quick socials |
| 🧭 **Start Menu** | App launcher, socials, shutdown animation |
| 📟 **Terminal** | `help`, `projects`, `skills`, `contact`, `neofetch`, `theme`, `date`, tab-complete, arrow-key history |
| 🖱️ **Right-click** | Refresh, open terminal, wallpaper submenu, close-all-windows, reset layout |
| ⌘ **Command Palette** | `Ctrl + K` fuzzy launcher |
| ⚙️ **Settings** | Accent color, wallpaper, icon size, cursor style, animation speed, sound, theme |
| 🌫️ **Parallax** | Wallpaper drifts subtly with your mouse |
| ✳️ **Custom cursor** | Retro or dot variants that react on hover |
| 💾 **Persistence** | Icons, theme, and every setting saved to `localStorage` |
| 🐙 **Projects app** | Live GitHub feed for [`azhar0i0`](https://github.com/azhar0i0) |
| 📱 **Dedicated mobile view** | On phones the desktop gives way to a focused two-tab layout (**Me** / **Work**) that keeps the retro vibe — same content, thumb-friendly |
| ⚡ **SSR** | Server-rendered via TanStack Start, deployable to the edge on Cloudflare |

### ⌨️ Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Ctrl + K` | Command palette |
| `Alt + Tab` | Cycle windows |
| `Ctrl + M` | Minimize active window |
| `Esc` | Close active window / palette / menu |
| `Enter` | Open focused desktop icon |

---

## 🧰 Stack

**Framework & routing**
- [React 19](https://react.dev) + [TanStack Start](https://tanstack.com/start) — full-stack SSR on Vite 8
- [TanStack Router](https://tanstack.com/router) — type-safe, file-based routing
- [TanStack Query](https://tanstack.com/query) — server state & data fetching

**State & UI**
- [Zustand](https://zustand-demo.pmnd.rs/) with `persist` middleware — window / icon / settings stores
- [Tailwind CSS v4](https://tailwindcss.com) + [Radix UI](https://www.radix-ui.com) primitives, custom paper/olive design system
- [Framer Motion](https://www.framer.com/motion/) — animation
- [`react-rnd`](https://github.com/bokuweb/react-rnd) — draggable & resizable windows
- [Lucide](https://lucide.dev) & [react-icons](https://react-icons.github.io/react-icons/) — iconography

**Tooling & delivery**
- [TypeScript](https://www.typescriptlang.org) (strict) · [Vite 8](https://vite.dev) · [Lightning CSS](https://lightningcss.dev)
- [Zod](https://zod.dev) · [react-hook-form](https://react-hook-form.com)
- [Nitro](https://nitro.build) → [Cloudflare Workers](https://developers.cloudflare.com/workers/) deploy target
- ESLint · Prettier

---

## 🚀 Getting started

**Prerequisites:** [Node.js](https://nodejs.org) 20+ and npm.

```bash
# 1. Clone
git clone https://github.com/azhar0i0/Portfolio.git
cd Portfolio

# 2. Install
npm install

# 3. Boot the desktop
npm run dev
```

The app boots at **http://localhost:8080**.

### 📜 Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build (SSR + Cloudflare bundle via Nitro) |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the codebase with ESLint |
| `npm run format` | Format with Prettier |

---

## 🗂️ Project structure

```text
src/
├── routes/                  TanStack Start file-based routes
│   ├── __root.tsx           shell, fonts, favicon, error boundary
│   └── index.tsx            mounts <Desktop />
├── components/
│   ├── desktop/             Desktop, Window, Taskbar, StartMenu,
│   │                        ContextMenu, CommandPalette, BootScreen
│   ├── apps/                Home, About, Projects, Skills, Services,
│   │                        Contact, Resume, Terminal, Settings
│   └── ui/                  Reusable Radix-based UI primitives
├── lib/
│   ├── desktop/
│   │   ├── store.ts         Zustand stores: windows, icons, settings
│   │   └── apps.tsx         App registry + metadata
│   ├── error-capture.ts     SSR error capture
│   └── error-reporting.ts   Client error-boundary reporting
├── server.ts                SSR entry with a hardened error wrapper
└── styles.css               Design tokens, wallpapers, custom cursor
```

> **Routing note:** every `.tsx` in `src/routes/` is a route.
> `routeTree.gen.ts` is auto-generated — never edit it by hand.

---

## 🎨 Design system

Everything is a semantic token — never a hardcoded color.

| Token | Value |
| ----- | ----- |
| `--paper` | warm off-white base |
| `--olive` / `--olive-dark` | primary taskbar & window chrome |
| `--orange` | accent (rebindable at runtime from Settings) |
| `--ink` / `--ink-soft` | text |
| `--folder` / `--folder-tab` | classic yellow folder icon |

Change the accent in Settings and every ring, chip, cursor, and highlight
updates live.

---

## ➕ Extend

Add a new app in three steps:

1. Drop `MyApp.tsx` in `src/components/apps/`.
2. Register it in `src/lib/desktop/apps.tsx` and add its ID to `AppId` in `src/lib/desktop/store.ts`.
3. Add a default icon position in `DEFAULT_ICONS`.

The window manager, taskbar entry, terminal command, and command palette pick it
up automatically.

---

## ☁️ Deployment

The production build emits a Cloudflare-ready bundle:

```bash
npm run build
npx nitro deploy --prebuilt   # deploy to Cloudflare Workers
```

Prefer a different host? Nitro supports many presets — swap `cloudflare-module`
in [`vite.config.ts`](vite.config.ts) for `node-server`, `vercel`, `netlify`, and more.

---

## 👤 Credits

Designed & built by **Azhar Ali**

[![GitHub](https://img.shields.io/badge/GitHub-azhar0i0-181717?logo=github&logoColor=white)](https://github.com/azhar0i0)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/skibidi-azhar)
[![Email](https://img.shields.io/badge/Email-Say_hi-EA4335?logo=gmail&logoColor=white)](mailto:azharisworking@gmail.com)

<sub>Inspired by Windows 95/XP, macOS System 7, and every developer who ever
missed the sound of a startup chime.</sub>
