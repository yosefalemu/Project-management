"use client";
import ResponsiveModal from "@/components/responsive-modal";
import { useChannelModalHook } from "@/features/channels/hooks/use-channel-modal";
import ChannelForm from "@/features/channels/components/channel-form";

export default function ChannelModal() {
  const { isOpen, setIsOpen } = useChannelModalHook();
  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      className="sm:max-w-xl xl:max-w-6xl lg:max"
    >
      <ChannelForm />
    </ResponsiveModal>
  );
}
