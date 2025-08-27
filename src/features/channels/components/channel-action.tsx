import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

interface ChannelActionProps {
  children: React.ReactNode;
  channelId: string;
}
export default function ChannelAction({
  children,
  channelId,
}: ChannelActionProps) {
  const [ConfirmDialog, confirm] = useConfirm(
    "Leave channel?",
    "Are you sure you want to leave this channel?",
    {
      cancelLabel: "Cancel",
      confirmLabel: "Leave",
      variant: "destructive",
    }
  );

  const leaveChannel = async () => {
    const ok = await confirm();
    if (!ok) return;
    toast.success("You have left the channel");
  };
  return (
    <DropdownMenu>
      <ConfirmDialog />
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-64">
        <DropdownMenuLabel className="hidden">{channelId}</DropdownMenuLabel>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-700 focus:text-red-500 cursor-pointer"
          onClick={leaveChannel}
        >
          Leave channel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
