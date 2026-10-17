import { createFileRoute } from "@tanstack/react-router";
import { Desktop } from "@/components/desktop/Desktop";
import { MobileView } from "@/components/mobile/MobileView";
import { BootScreen } from "@/components/desktop/BootScreen";
import { useViewport } from "@/hooks/use-mobile";
import { SEO, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SEO.title },
      { name: "description", content: SEO.description },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:title", content: SEO.ogTitle },
      { property: "og:description", content: SEO.ogDescription },
      { name: "twitter:title", content: SEO.ogTitle },
      { name: "twitter:description", content: SEO.ogDescription },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: Home,
});

function Home() {
  // undefined until the first client effect. Until then (server render and
  // hydration) both layouts are rendered and CSS shows the one that fits, so
  // the server HTML carries the full profile instead of an empty desktop.
  const viewport = useViewport();
  return (
    <>
      {viewport !== "desktop" && (
        <div className="md:hidden">
          <MobileView />
        </div>
      )}
      {viewport !== "mobile" && (
        <div className="hidden md:block">
          <Desktop />
        </div>
      )}
      <BootScreen />
    </>
  );
}
