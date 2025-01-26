"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingLayout from "./loading-layout";
import { useGetWorkspaces } from "@/features/workspace/api/get-workspaces-api";

export default function Dashboard() {
  const router = useRouter();

  const { data, isLoading, isError, isRefetching, refetch } =
    useGetWorkspaces();

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
