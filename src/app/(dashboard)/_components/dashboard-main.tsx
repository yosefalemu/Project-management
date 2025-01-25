"use client";
import { useCurrentGetWorkspace } from "@/features/workspace/api/current-workspace-api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingLayout from "./loading-layout";

export default function Dashboard() {
  const workspaceIdFromLocalStorage = localStorage.getItem("lastWorkspaceId");
  const workspaceId = workspaceIdFromLocalStorage || "randomworkspaceid";
  const router = useRouter();

  const { data, isLoading, isError, isRefetching, refetch } =
    useCurrentGetWorkspace(workspaceId);

  const loading = isLoading || isRefetching;

  useEffect(() => {
    if (!loading && !isError && data) {
      if (data.length === 0) {
        router.push("/stworkspaces/newworkspace");
      } else {
        router.push(`/workspaces/${data[0].id}`);
      }
    }
  }, [loading, isError, data, router, refetch]);

  return (
    <div className="h-full">
      {loading ? (
        <LoadingLayout />
      ) : isError ? (
        <div>Error loading workspace</div>
      ) : null}
    </div>
  );
}
