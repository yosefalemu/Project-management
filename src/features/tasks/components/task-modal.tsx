"use client";
import ResponsiveModal from "@/components/responsive-modal";
import { useTaskModalHook } from "../hooks/use-task-modal";
import CreateTaskFormWrapper from "./create-task-form-wrapper";

export default function TaskModal() {
  const { isOpen, setIsOpen } = useTaskModalHook();
  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      className="sm:max-w-xl xl:max-w-6xl lg:max"
    >
      <CreateTaskFormWrapper />
    </ResponsiveModal>
  );
}
