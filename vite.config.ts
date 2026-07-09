import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// TanStack Start + Vite configuration.
//
// Plugin order matters: tsconfig paths → Tailwind → TanStack Start → Nitro →
// React. Nitro only runs for `vite build` (it wires up the server bundle /
// deploy target); the dev server doesn't need it.
export default defineConfig(({ command }) => ({
  // Run Lightning CSS in dev too, so the dev preview matches the built output.
  // Vite otherwise uses PostCSS in dev and only runs Lightning CSS at build,
  // which lets build-only CSS transforms silently diverge from what you see.
  css: { transformer: "lightningcss" },

  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
    // Keep a single copy of React and TanStack Query in the graph to avoid
    // "invalid hook call" / duplicate-context bugs.
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },

  // Pre-bundle the always-present client deps so a dep re-optimization doesn't
  // 504 tabs mid-session. React core only — pulling @tanstack/react-start here
  // would drag its server entry into the client bundle and break hydration.
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },

  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      // Fail the build if server-only code leaks into a client bundle.
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
      // Redirect TanStack Start's bundled server entry to src/server.ts (our
      // SSR error wrapper). Nitro/Vite builds from this.
      server: { entry: "server" },
    }),
    // Build-only: produces the deployable server bundle (Cloudflare by default).
    ...(command === "build" ? [nitro({ defaultPreset: "cloudflare-module" })] : []),
    viteReact(),
  ],
}));
