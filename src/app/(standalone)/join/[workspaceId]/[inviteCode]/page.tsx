"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWorkspaceInfo } from "@/features/workspace/api/get-workspace-info";
import JoinWorkspaceForm from "@/features/workspace/components/join-workspace-form";
import { useParams } from "next/navigation";

export default function JoinWorkspacePage() {
  const params: { workspaceId: string; inviteCode: string } = useParams();
  const { data, isPending, isError } = useGetWorkspaceInfo(params.workspaceId);

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="p-7 text-center">
            <div className="flex justify-center">
              <Skeleton className="w-20 h-20 rounded-full" />
            </div>
            <Skeleton className="h-7 w-32 mx-auto mt-4" />
            <div className="flex flex-col gap-2 mt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <Skeleton className="h-10 w-full lg:w-1/2 rounded-md" />
              <Skeleton className="h-10 w-full lg:w-1/2 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <JoinWorkspaceForm
        workspaceId={params.workspaceId}
        inviteCode={params.inviteCode}
        workspaceFound={
          data
            ? {
                ...data,
                image: data.image === null ? undefined : data.image,
              }
            : data
        }
      />
    </div>
  );
}
