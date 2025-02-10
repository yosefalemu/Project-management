import DootedSeparator from "@/components/dooted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { CopyIcon, Loader } from "lucide-react";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { useUpdateInviteCodeWorkspace } from "../api/update-invitecode-api";

interface InvitecodeProps {
  inviteCode: string;
  workspaceId: string;
  loadingState: boolean;
  setIsResetInviteCodeLoading: (status: boolean) => void;
}
export default function InviteCode({
  inviteCode,
  workspaceId,
  loadingState,
  setIsResetInviteCodeLoading,
}: InvitecodeProps) {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const fullInviteCode = `${window.location.origin}/workspaces/${workspaceId}/join/${inviteCode}`;
  const { mutate, isPending } = useUpdateInviteCodeWorkspace();
  const [ResetInviteCode, confirmReset] = useConfirm(
    "Reset invite code",
    "This will invalidate the current invite link, you will have to share the new invite link with your team members",
    "destructive"
  );
  const handleDeleteWorkspace = async () => {
    const ok = await confirmReset();
    if (!ok) {
      return;
    }
    setIsResetInviteCodeLoading(true);
    mutate(
      { param: { workspaceId: workspaceId } },
      {
        onSuccess: () => {
          setIsResetInviteCodeLoading(false);
          toast.success("Invite code reset successfully");
        },
        onError: () => {
          setIsResetInviteCodeLoading(false);
          toast.error("An error occurred while resetting invite code");
        },
      }
    );
  };
  return (
    <div>
      <ResetInviteCode />
      <Card className="shadow-none border-none bg-neutral-0 col-span-1 bg-neutral-50">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold text-lg" onClick={() => {}}>
              Invite code
            </h3>
            <p className="text-sm text-muted-foreground">
              Use the invite code to add members to your workspace.
            </p>
          </div>
          <div className="mt-5">
            <div className="flex items-center gap-x-2">
              <Input disabled={true} value={fullInviteCode} className="h-12" />
              <Button
                onClick={() =>
                  navigator.clipboard
                    .writeText(fullInviteCode)
                    .then(() =>
                      toast.success("Invite code copied to clipboard")
                    )
                }
                variant="ghost"
                className="size-12"
                disabled={loadingState}
              >
                <CopyIcon className="size-5" />
              </Button>
            </div>
            <DootedSeparator className="py-7" />
            <div className="w-full flex justify-end">
              {" "}
              <Button
                className="mt-6 w-fit"
                size={isDesktop ? "lg" : "sm"}
                variant="destructive"
                type="button"
                onClick={handleDeleteWorkspace}
                disabled={loadingState || isPending}
              >
                {isPending ? <Loader className="animate-spin" /> : null}
                {isPending ? "Reseting" : "Reset invite code"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
