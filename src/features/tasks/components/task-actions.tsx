"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteTask } from "../api/delete-task-api";
import { toast } from "sonner";
import { Task } from "../constant/types";
import ResponsiveModal from "@/components/responsive-modal";
import TaskForm from "./task-form";
import { useGetProjectMembers } from "@/features/projects/api/get-project-member-api";
import { useParams } from "next/navigation";

interface TaskActionsProps {
  task: Task;
  children: React.ReactNode;
}
export default function TaskActions({ task, children }: TaskActionsProps) {
  const params = useParams();
  const { data: membersFound, isLoading: isLoadingMembers } =
    useGetProjectMembers({
      projectId: params.projectId as string,
      workspaceId: params.workspaceId as string,
    });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const { mutate: deleteTask } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "This task will be removed from the project",
    {
      variant: "destructive",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    }
  );
  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;
    deleteTask(
      { param: { taskId: task.id } },
      {
        onSuccess: () => {
          toast.success("Task deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };
  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <ResponsiveModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        className="sm:max-w-xl lg:max-w-5xl xl:max-w-6xl"
      >
        <TaskForm
          membersOptions={
            membersFound
              ? membersFound.map((member) => ({
                  id: member.id,
                  name: member.name,
                  image: member.image ?? undefined,
                }))
              : []
          }
          task={task}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      </ResponsiveModal>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-0 rounded-sm">
          <DropdownMenuItem
            onClick={() => setIsTaskModalOpen(true)}
            className="font-medium rounded-none cursor-pointer"
            disabled={isLoadingMembers || !task}
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteTask}
            className="font-medium rounded-none cursor-pointer text-red-700 focus:text-red-700"
            disabled={!task}
          >
            <Trash2Icon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
