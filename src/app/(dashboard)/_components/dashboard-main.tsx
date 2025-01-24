"use client";

import { useCurrentGetWorkspace } from "@/features/workspace/api/current-workspace-api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingLayout from "./loading-layout";

export default function Dashboard() {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const router = useRouter();

  const { data, isLoading, isError } = useCurrentGetWorkspace(
    workspaceId || "randomworkspaceid"
  );

  useEffect(() => {
    const lastWorkspaceId = localStorage.getItem("lastWorkspaceId");
    setWorkspaceId(lastWorkspaceId || null);
  }, []);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      if (data.length === 0) {
        router.push("/workspaces/create");
      } else {
        router.push(`/workspaces/${data[0].id}`);
      }
    }
  }, [isLoading, isError, data, router]);

  return (
    <div className="h-full">
      {isLoading ? (
        <LoadingLayout />
      ) : isError ? (
        <div>Error loading workspace</div>
      ) : null}
    </div>
  );
}
