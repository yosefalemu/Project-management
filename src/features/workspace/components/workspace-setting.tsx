"use client";
import DootedSeparator from "@/components/dooted-separator";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWorkspace } from "@/features/workspace/api/get-workspace-api";
import WorkSpaceForm from "@/features/workspace/components/workspace-form";
import { useParams } from "next/navigation";

export default function WorkspaceSettingComponent() {
  const params = useParams();
  const {
    data: workspace,
    isLoading: isLoadingWorkspace,
    isError: isErrorWorkspace,
  } = useGetWorkspace(params.workspaceId as string);

  if (isLoadingWorkspace || !workspace) {
    return (
      <div className="h-full w-full flex flex-col gap-y-4 max-h-[550px] overflow-y-auto py-14 hide-scrollbar">
        <Card className="shadow-none border-none w-full">
          <CardContent className="">
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-y-4 w-full">
                {/* Skeleton for Workspace Name Input */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                {/* Skeleton for Workspace Description Textarea */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-24 w-full" />
                </div>
                {/* Skeleton for Image Uploader */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-32 w-32" />
                </div>
              </div>
              <DootedSeparator className="block xl:hidden py-7" />
              <div className="flex flex-col gap-y-4 w-full">
                {/* Skeleton for Column Two */}
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
            <DootedSeparator className="py-7" />
            <div className="flex items-center justify-end gap-x-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
        {/* Skeleton for InviteCode and DangerZone */}
        <div className="flex flex-col gap-y-4 px-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }
  if (isErrorWorkspace) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Error loading workspace
      </div>
    );
  }

  const transformedData = {
    ...workspace,
    createdAt: new Date(workspace.createdAt!),
    updatedAt: new Date(workspace.updatedAt!),
    inviteCodeExpire: new Date(workspace.inviteCodeExpire!),
  };

  return (
    <div className="h-full w-full">
      <WorkSpaceForm workspace={transformedData} />
    </div>
  );
}
