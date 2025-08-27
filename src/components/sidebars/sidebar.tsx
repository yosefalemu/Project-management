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
    <div
      className={cn(
        "h-[calc(100vh-3rem)] w-56 border-r p-0 absolute top-0 left-0",
        selectedFont.className
      )}
    >
      <Projects />
    </div>
  );
}
