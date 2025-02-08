"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteTask } from "../api/delete-task-api";
import { toast } from "sonner";

interface TaskActionsProps {
  id: string;
  children: React.ReactNode;
}
export default function TaskActions({ id, children }: TaskActionsProps) {
  const { mutate: deleteTask } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "This task will be removed from the project",
    "destructive"
  );
  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;
    deleteTask(
      { param: { taskId: id } },
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
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => {}}
            className="font-medium p-[10px]"
            disabled={false}
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {}}
            className="font-medium p-[10px]"
            disabled={false}
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteTask}
            className="font-medium p-[10px] text-amber-700 focus:text-amber-700"
            disabled={false}
          >
            <Trash2Icon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
