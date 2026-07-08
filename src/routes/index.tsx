import { createFileRoute } from "@tanstack/react-router";
import { Desktop } from "@/components/desktop/Desktop";

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
  return <Desktop />;
}
