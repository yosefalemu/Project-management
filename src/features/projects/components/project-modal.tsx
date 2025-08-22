"use client";
import ResponsiveModal from "@/components/responsive-modal";
import { useProjectModalHook } from "../hooks/use-project-modal";
import ProjectForm from "./project-form";

export default function ProjectModal() {
  const { isOpen, setIsOpen, close } = useProjectModalHook();
  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      className="sm:max-w-xl xl:max-w-6xl lg:max"
    >
      <ProjectForm setIsModalOpen={close} />
    </ResponsiveModal>
  );
}
