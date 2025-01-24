"use client";
import ResponsiveModal from "@/components/responsive-modal";
import CreateWorkSpaceForm from "./create-workspace-form";
import { useCreateWorkspaceModalHook } from "../hooks/use-create-workspace-modal";

export default function CreateWorkspaceModal() {
  const { isOpen, setIsOpen } = useCreateWorkspaceModalHook();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkSpaceForm onModal={true} />
    </ResponsiveModal>
  );
}
