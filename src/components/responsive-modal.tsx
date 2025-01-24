import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "./ui/drawer";
import { useMedia } from "react-use";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function ResponsiveModal({
  children,
  open,
  onOpenChange,
}: ResponsiveModalProps) {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle className="hidden" />
        <DialogContent className="w-full sm:max-w-lg py-2 border-none overflow-y-auto max-h-[85vh] hide-scrollbar">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTitle className="hidden" />
      <DrawerContent>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
