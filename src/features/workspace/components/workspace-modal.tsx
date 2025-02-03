"use client";
import ResponsiveModal from "@/components/responsive-modal";
import WorkSpaceForm from "./workspace-form";
import { useWorkspaceModalHook } from "../hooks/use-workspace-modal";

export default function WorkspaceModal() {
  const { isOpen, setIsOpen } = useWorkspaceModalHook();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <WorkSpaceForm onModal={true} />
    </ResponsiveModal>
  );
}
