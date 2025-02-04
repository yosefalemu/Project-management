import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfirm } from "@/hooks/use-confirm";
import { useMedia } from "react-use";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import DootedSeparator from "@/components/dooted-separator";
import { useDeleteProject } from "../api/delete-project-api";

interface DangerZoneProps {
  projectId: string;
  workspaceId: string;
  loadingState: boolean;
  setIsDeleteLoading: (status: boolean) => void;
}
export default function DangerZone({
  projectId,
  workspaceId,
  loadingState,
  setIsDeleteLoading,
}: DangerZoneProps) {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete project",
    "This action cannot be undo",
    "destructive"
  );
  const { mutate, isPending } = useDeleteProject();
  const handleDeleteProject = async () => {
    const ok = await confirmDelete();
    if (!ok) {
      return;
    }
    setIsDeleteLoading(true);
    mutate(
      { param: { projectId } },
      {
        onSuccess: () => {
          setIsDeleteLoading(false);
          toast.success("Project deleted successfully");
          window.location.href = `/workspaces/${workspaceId}`;
        },
        onError: () => {
          setIsDeleteLoading(false);
          toast.error("An error occurred while deleting project");
        },
      }
    );
  };
  return (
    <div>
      <DeleteDialog />
      <Card className="shadow-none border-none bg-neutral-50 col-span-1">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold text-lg">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a project is irreversible and will remove all associated
              data.
            </p>
            <DootedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size={isDesktop ? "lg" : "sm"}
              variant="destructive"
              type="button"
              onClick={handleDeleteProject}
              disabled={loadingState}
            >
              {isPending ? <Loader className="animate-spin" /> : null}
              {isPending ? "Deleting" : "Delete Project"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
