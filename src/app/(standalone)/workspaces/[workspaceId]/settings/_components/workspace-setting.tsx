"use client";
import { useGetWorkspace } from "@/features/workspace/api/get-workspace-api";
import CreateWorkSpaceForm from "@/features/workspace/components/create-workspace-form";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import LoadingComponent from "./loading-component";

export default function SettingComponent() {
  const params = useParams();
  const { data, isLoading, isError, refetch, isRefetching } = useGetWorkspace(
    params.workspaceId as string
  );

  useEffect(() => {
    if (params.workspaceId) {
      refetch();
    }
  }, [refetch, params.workspaceId]);

  const transformedData = data
    ? {
        ...data,
        createdAt: new Date(data.createdAt!),
        updatedAt: new Date(data.updatedAt!),
        inviteCodeExpire: new Date(data.inviteCodeExpire!),
      }
    : null;
  return (
    <div className="w-full flex flex-col items-start gap-x-2">
      <div className="h-full w-full">
        {isLoading || isRefetching ? (
          <div className="relative">
            <LoadingComponent />
          </div>
        ) : isError ? (
          <div>Error</div>
        ) : transformedData ? (
          <CreateWorkSpaceForm workspace={transformedData} />
        ) : null}
      </div>
    </div>
  );
}
