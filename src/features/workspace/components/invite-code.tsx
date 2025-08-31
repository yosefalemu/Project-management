import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { ClockAlert, CopyIcon, Loader } from "lucide-react";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { useUpdateInviteCodeWorkspace } from "../api/update-invitecode-api";

interface InvitecodeProps {
  inviteCode: string;
  workspaceId: string;
  inviteCodeExpire: Date;
}
export default function InviteCode({
  inviteCode,
  workspaceId,
  inviteCodeExpire,
}: InvitecodeProps) {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const fullInviteCode = `${window.location.origin}/join/${workspaceId}/${inviteCode}`;
  const { mutate, isPending } = useUpdateInviteCodeWorkspace();
  const [ResetInviteCode, confirmReset] = useConfirm(
    "Reset invite code",
    "This will invalidate the current invite link, you will have to share the new invite link with your team members",
    {
      variant: "destructive",
      confirmLabel: "Reset",
      cancelLabel: "Cancel",
    }
  );
  const handleDeleteWorkspace = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    mutate(
      { param: { workspaceId: workspaceId } },
      {
        onSuccess: () => {
          toast.success("Invite code reset successfully");
        },
        onError: () => {
          toast.error("An error occurred while resetting invite code");
        },
      }
    );
  };
  return (
    <div>
      <ResetInviteCode />
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Invite code</CardTitle>
          <CardDescription>
            Use the invite code to add members to your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-2">
            <Input disabled={true} value={fullInviteCode} className="h-12" />
            <Button
              onClick={() =>
                navigator.clipboard
                  .writeText(fullInviteCode)
                  .then(() => toast.success("Invite code copied to clipboard"))
              }
              variant="ghost"
              className="size-12 disabled:cursor-not-allowed"
              disabled={isPending || inviteCodeExpire < new Date()}
              type="button"
            >
              {inviteCodeExpire < new Date() ? (
                <ClockAlert className="size-5" />
              ) : (
                <CopyIcon className="size-5" />
              )}
            </Button>
          </div>
          <div className="w-full flex justify-end">
            <Button
              className="w-fit"
              size={isDesktop ? "lg" : "sm"}
              variant="default"
              type="button"
              onClick={handleDeleteWorkspace}
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin" />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Reset Invite Code
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
