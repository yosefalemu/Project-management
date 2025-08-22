import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useMedia } from "react-use";
import { Loader } from "lucide-react";
import { useDeleteProject } from "../api/delete-project-api";

interface DangerZoneProps {
  projectId: string;
}
export default function DangerZone({ projectId }: DangerZoneProps) {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete project",
    "This action cannot be undo",
    {
      variant: "destructive",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    }
  );
  const { mutate, isPending } = useDeleteProject();
  const handleDeleteProject = async () => {
    const ok = await confirmDelete();
    if (!ok) {
      return;
    }
    mutate({ param: { projectId } });
  };
  return (
    <div className="w-full col-span-2">
      <DeleteDialog />
      <div className="flex flex-col border-2 rounded-sm p-7">
        <h3 className="font-bold text-lg">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Deleting a project is irreversible and will remove all associated
          data.
        </p>
        <Button
          className="mt-6 w-fit ml-auto"
          size={isDesktop ? "lg" : "sm"}
          variant="destructive"
          type="button"
          onClick={handleDeleteProject}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin" />
            </span>
          ) : (
            <p>Delete Project</p>
          )}
        </Button>
      </div>
    </div>
  );
}
