"use client";
import ResponsiveModal from "@/components/responsive-modal";
import { useTaskModalHook } from "../hooks/use-task-modal";
import TaskForm from "./task-form";
import { useParams } from "next/navigation";
import { useGetProjectMembers } from "@/features/projects/api/get-project-member-api";
import { Skeleton } from "@/components/ui/skeleton";

export default function TaskModal() {
  const { isOpen, setIsOpen } = useTaskModalHook();
  const params = useParams();
  const { data: membersFound, isLoading: isLoadingMembers } =
    useGetProjectMembers({
      projectId: params.projectId as string,
      workspaceId: params.workspaceId as string,
    });

  const memberOptions = membersFound?.map((member) => ({
    id: member.id || "",
    name: member.name || "",
  }));
  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      className="sm:max-w-xl lg:max-w-5xl xl:max-w-6xl"
    >
      {isLoadingMembers ? (
        <div className="flex flex-col p-4 lg:p-6 w-full">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <div className="grid md:grid-cols-2 gap-4 items-start">
            <div className="col-span-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="col-span-1 space-y-2 flex flex-col h-full">
              <Skeleton className="h-4 w-1/3" /> 
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" /> 
              <div className="flex items-end justify-end gap-x-6 flex-1">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <TaskForm membersOptions={memberOptions || []} />
      )}
    </ResponsiveModal>
  );
}
