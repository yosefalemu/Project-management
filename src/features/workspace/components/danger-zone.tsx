import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useConfirm } from "@/hooks/use-confirm";
import { useMedia } from "react-use";
import { useDeleteWorkspace } from "../api/delete-workspace-api";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DangerZoneProps {
  workspaceId: string;
  loadingState: boolean;
  setIsDeleteLoading: (status: boolean) => void;
}
export default function DangerZone({
  workspaceId,
  loadingState,
  setIsDeleteLoading,
}: DangerZoneProps) {
  const router = useRouter();
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete workspace",
    "This action cannot be undo",
    {
      variant: "destructive",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    }
  );
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
          router.push("/");
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
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Deleting a workspace is irreversible and will remove all associated
            data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-end">
          <Button
            className="w-fit"
            size={isDesktop ? "lg" : "sm"}
            variant="destructive"
            type="button"
            onClick={handleDeleteWorkspace}
            disabled={loadingState}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Delete Workspace
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
