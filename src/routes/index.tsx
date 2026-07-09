import { createFileRoute } from "@tanstack/react-router";
import { Desktop } from "@/components/desktop/Desktop";
import { MobileView } from "@/components/mobile/MobileView";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Azhar Ali — Full-Stack Developer · AzharOS Portfolio" },
      {
        name: "description",
        content:
          "Explore Azhar Ali's portfolio as an interactive desktop OS: projects from GitHub, skills, resume, terminal, and more.",
      },
      { property: "og:title", content: "Azhar Ali — AzharOS Portfolio" },
      {
        property: "og:description",
        content:
          "An interactive retro desktop portfolio built with React, TanStack Start & Framer Motion.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const isMobile = useIsMobile();
  // On phones the desktop-OS metaphor gives way to a focused two-tab layout.
  return isMobile ? <MobileView /> : <Desktop />;
}
