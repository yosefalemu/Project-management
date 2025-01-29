"use client";
import { useGetWorkspace } from "@/features/workspace/api/get-workspace-api";
import CreateWorkSpaceForm from "@/features/workspace/components/create-workspace-form";
import { useEffect } from "react";
import LoadingLayout from "../../_components/loading-layout";
import { useParams } from "next/navigation";

export default function WorkspacePage() {
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
    <div className="h-full">
      {isLoading || isRefetching ? (
        <LoadingLayout />
      ) : isError ? (
        <div>Error</div>
      ) : transformedData ? (
        <CreateWorkSpaceForm workspace={transformedData} />
      ) : null}
    </div>
  );
}
