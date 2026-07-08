import type { ComponentType } from "react";
import type { AppId } from "./store";
import { HomeApp } from "@/components/apps/HomeApp";
import { AboutApp } from "@/components/apps/AboutApp";
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { SkillsApp } from "@/components/apps/SkillsApp";
import { ServicesApp } from "@/components/apps/ServicesApp";
import { ContactApp } from "@/components/apps/ContactApp";
import { ResumeApp } from "@/components/apps/ResumeApp";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { SettingsApp } from "@/components/apps/SettingsApp";

export const APP_COMPONENTS: Record<AppId, ComponentType> = {
  home: HomeApp,
  about: AboutApp,
  projects: ProjectsApp,
  skills: SkillsApp,
  services: ServicesApp,
  contact: ContactApp,
  resume: ResumeApp,
  terminal: TerminalApp,
  settings: SettingsApp,
};

export const APP_META: Record<AppId, { label: string; hint: string }> = {
  home: { label: "Home", hint: "About Azhar at a glance" },
  about: { label: "About", hint: "Story, values, timeline" },
  projects: { label: "Projects", hint: "Live GitHub portfolio" },
  skills: { label: "Skills", hint: "Frontend, backend, tools" },
  services: { label: "Services", hint: "What I can build for you" },
  contact: { label: "Contact", hint: "Send a message" },
  resume: { label: "Resume", hint: "Experience & education" },
  terminal: { label: "Terminal", hint: "Try `help`" },
  settings: { label: "Settings", hint: "Theme & wallpaper" },
};
