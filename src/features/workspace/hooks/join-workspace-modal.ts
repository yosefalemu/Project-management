import { useQueryState, parseAsBoolean } from "nuqs";

export const useWorkspaceJoinModalHook = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "join-workspace",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close, setIsOpen };
};
