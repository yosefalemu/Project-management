"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProject } from "@/features/projects/api/get-project-api";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import ProjectHuddle from "@/features/projects/components/project-huddle";
import ProjectMembers from "@/features/projects/components/project-members";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { useParams } from "next/navigation";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { data, isLoading } = useGetProject({ projectId });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-4 h-full p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
        <Skeleton className="flex flex-col gap-y-8 flex-1 bg-transparent">
          <div className="flex gap-x-2">
            <Skeleton className="h-8 w-20 bg-primary/15" />
            <Skeleton className="h-8 w-20 bg-primary/15" />
          </div>
          <Skeleton className="h-8 w-56 bg-primary/15" />
          <div className="flex flex-col gap-y-4">
            <Skeleton className="h-12 w-full bg-primary/15" />
            <Skeleton className="h-12 w-full bg-primary/15" />
            <Skeleton className="h-12 w-full bg-primary/15" />
            <Skeleton className="h-12 w-full bg-primary/15" />
          </div>
        </Skeleton>
      </div>
    );
  }
  return (
    <div className="flex flex-col px-4 py-1 gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={data?.name || ""}
            image={data?.image ?? undefined}
            className="size-6 rounded-sm"
          />
          <p className="text-lg font-semibold uppercase">{data?.name}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <ProjectMembers
            projectId={projectId}
            workspaceId={data?.workspaceId}
          />
          <ProjectHuddle />
        </div>
      </div>
      <div className="flex-1">
        <TaskViewSwitcher />
      </div>
    </div>
  );
}
