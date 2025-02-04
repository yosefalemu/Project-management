"use client";
import ResponsiveModal from "@/components/responsive-modal";
import { useTaskModalHook } from "../hooks/use-task-modal";
import CreateTaskFormWrapper from "./create-task-form-wrapper";

export default function TaskModal() {
  const { isOpen, setIsOpen } = useTaskModalHook();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper />
    </ResponsiveModal>
  );
}
