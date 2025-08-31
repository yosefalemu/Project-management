"use client";
import ResponsiveModal from "@/components/responsive-modal";
import WorkSpaceForm from "./workspace-form";
import { useWorkspaceModalHook } from "../hooks/use-workspace-modal";

export default function WorkspaceModal() {
  const { isOpen, setIsOpen } = useWorkspaceModalHook();
  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      className="sm:max-w-xl lg:max-w-5xl xl:max-w-6xl"
    >
      <WorkSpaceForm />
    </ResponsiveModal>
  );
}
