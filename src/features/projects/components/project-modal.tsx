"use client";
import ResponsiveModal from "@/components/responsive-modal";
import { useProjectModalHook } from "../hooks/use-project-modal";
import CreateProjectForm from "./project-form";

export default function ProjectModal() {
  const { isOpen, setIsOpen } = useProjectModalHook();
  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      className="sm:max-w-xl xl:max-w-6xl lg:max"
    >
      <CreateProjectForm onModal={true} />
    </ResponsiveModal>
  );
}
