"use client";
// import Navigation from "@/components/navigation";
import Projects from "@/components/projects";
import { fonts } from "@/lib/font";
import { cn } from "@/lib/utils";
import { fontProfile } from "@/states/font/font-state";

export default function Sidebar() {
  const { font } = fontProfile();
  const selectedFont = fonts[font] || fonts["Inter"];

  return (
    <div className={cn("h-full w-56 border-r p-0.5", selectedFont.className)}>
      <Projects />
    </div>
  );
}
