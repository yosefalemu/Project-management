import { useQueryState, parseAsBoolean } from "nuqs";

export const useChannelModalHook = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "channel",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close, setIsOpen };
};
