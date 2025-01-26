import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfirm } from "@/hooks/use-confirm";
import { useMedia } from "react-use";
import { useDeleteWorkspace } from "../api/delete-workspace-api";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface DangerZoneProps {
  workspaceId: string;
  setIsDeleteLoading: (status: boolean) => void;
}
export default function DangerZone({
  workspaceId,
  setIsDeleteLoading,
}: DangerZoneProps) {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete workspace",
    "This action cannot be undo",
    "destructive"
  );
  console.log("WORKSPACE ID TO DELETE", workspaceId);
  const { mutate, isPending } = useDeleteWorkspace();
  const handleDeleteWorkspace = async () => {
    const ok = await confirmDelete();
    if (!ok) {
      return;
    }
    setIsDeleteLoading(true);
    mutate(
      { param: { workspaceId: workspaceId } },
      {
        onSuccess: () => {
          setIsDeleteLoading(false);
          toast.success("Workspace deleted successfully");
          window.location.href = "/";
        },
        onError: () => {
          setIsDeleteLoading(false);
          toast.error("An error occurred while deleting workspace");
        },
      }
    );
  };
  return (
    <div>
      <DeleteDialog />
      <Card className="shadow-none border-none bg-neutral-100 col-span-1">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>
            <Button
              className="mt-6 w-fit ml-auto"
              size={isDesktop ? "lg" : "sm"}
              variant="destructive"
              type="button"
              onClick={handleDeleteWorkspace}
              disabled={isPending}
            >
              {isPending ? <Loader className="animate-spin" /> : null}
              {isPending ? "Deleting" : "Delete Workspace"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
