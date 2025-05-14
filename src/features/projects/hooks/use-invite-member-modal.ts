import { useQueryState, parseAsBoolean } from "nuqs";

export const useInviteMemberModalHook = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "invite-project-member",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { open, close, isOpen, setIsOpen };
};
