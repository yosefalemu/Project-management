"use client";
import ResponsiveModal from "@/components/responsive-modal";
import { useInviteMemberModalHook } from "../hooks/use-invite-member-modal";
import InviteMemberForm from "@/features/projects/components/add-member-form";

export default function InviteProjectMemberModal() {
  const { isOpen, setIsOpen } = useInviteMemberModalHook();
  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      className="sm:max-w-lg xl:max-w-xl p-8 pt-12 overflow-hidden"
    >
      <InviteMemberForm />
    </ResponsiveModal>
  );
}
