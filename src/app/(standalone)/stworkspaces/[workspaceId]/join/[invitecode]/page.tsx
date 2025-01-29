"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWorkspaceInfo } from "@/features/workspace/api/get-workspace-info";
import JoinWorkspaceForm from "@/features/workspace/components/join-workspace-form";
import { useParams } from "next/navigation";

export default function JoinWorkspacePage() {
  const params: { workspaceId: string; invitecode: string } = useParams();
  const { data, isPending, isError } = useGetWorkspaceInfo(params.workspaceId);

  return (
    <div className="w-full h-full lg:max-w-xl mx-auto">
      {isPending ? (
        <div className="w-full bg-white mt-20 flex flex-col justify-center items-center p-12 gap-y-4 rounded-2xl">
          <Skeleton className="h-20 w-20 rounded-full overflow-hidden" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex gap-x-2 w-full">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      ) : isError ? (
        <div>Error</div>
      ) : (
        <div className="w-full h-full mt-20 lg:max-w-xl">
          <JoinWorkspaceForm
            workspaceId={params.workspaceId}
            invitecode={params.invitecode}
            workspaceFound={data}
          />
        </div>
      )}
    </div>
  );
}
