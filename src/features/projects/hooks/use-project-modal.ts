import { useQueryState, parseAsBoolean } from "nuqs";

export const useProjectModalHook = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "project",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close, setIsOpen };
};
