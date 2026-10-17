import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  type ErrorComponentProps,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { useInspectGuard } from "../lib/useInspectGuard";
import { SEO, STRUCTURED_DATA } from "../lib/seo";

function NotFoundComponent() {
  return (
    <main className="desktop-wallpaper flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-[var(--chrome-border)] bg-card window-shadow">
        <div className="flex items-center gap-2 bg-[var(--chrome)] px-3 py-1.5 font-mono text-xs text-[var(--chrome-fg)]">
          {"C:\\AzharAli\\404"}
        </div>
        <div className="p-6">
          <p className="eyebrow">error 0x194 · path not found</p>
          <h1 className="mt-2 font-display text-5xl leading-none tracking-tight text-olive-dark">
            Nothing lives here
          </h1>
          <p className="mt-3 text-sm text-ink-soft">
            That file was moved, renamed, or never existed. The desktop has everything else.
          </p>
          <Link to="/" className="btn-primary mt-6 px-4 py-2 text-sm">
            Back to desktop
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Site-wide defaults; routes override title, description and canonical.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SEO.title },
      { name: "description", content: SEO.description },
      { name: "author", content: "Azhar Ali" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "theme-color", content: "#3d4a2a" },
      { property: "og:site_name", content: "Azhar Ali" },
      { property: "og:locale", content: "en_US" },
      { property: "og:type", content: "profile" },
      { property: "profile:first_name", content: "Azhar" },
      { property: "profile:last_name", content: "Ali" },
      { property: "og:image", content: SEO.image },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "675" },
      { property: "og:image:alt", content: SEO.imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SEO.image },
      { name: "twitter:image:alt", content: SEO.imageAlt },
      { "script:ld+json": STRUCTURED_DATA },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", href: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=VT323&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useInspectGuard();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Honor the OS "reduce motion" setting for every framer-motion animation. */}
      <MotionConfig reducedMotion="user">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </MotionConfig>
    </QueryClientProvider>
  );
}
