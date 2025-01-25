"use client";
import { useGetWorkspace } from "@/features/workspace/api/get-workspace-api";
import CreateWorkSpaceForm from "@/features/workspace/components/create-workspace-form";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import LoadingLayout from "../../_components/loading-layout";

export default function WorkspacePage() {
  const params = useParams();
  const { data, isLoading, isError, refetch, isRefetching } = useGetWorkspace(
    params.workspacesId as string
  );

  useEffect(() => {
    if (params.workspacesId) {
      refetch();
    }
  }, [refetch, params.workspacesId]);

  const transformedData = data
    ? {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      }
    : null;

  return (
    <div className="h-full">
      {isLoading || isRefetching ? (
        <LoadingLayout />
      ) : isError ? (
        <div>Error</div>
      ) : transformedData ? (
        <CreateWorkSpaceForm workspaces={transformedData} />
      ) : null}
    </div>
  );
}
