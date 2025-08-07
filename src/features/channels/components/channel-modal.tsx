"use client";
import ResponsiveModal from "@/components/responsive-modal";
import { useChannelModalHook } from "../hooks/use-channel-modal";

export default function ChannelModal() {
  const { isOpen, setIsOpen } = useChannelModalHook();
  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      className="sm:max-w-xl xl:max-w-6xl lg:max"
    >
      Create Channel Form
    </ResponsiveModal>
  );
}
