"use client";

import { useGetWorkspaces } from "@/features/workspace/api/get-workspaces-api";
import { useWorkspaceModalHook } from "@/features/workspace/hooks/use-workspace-modal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainPageClient() {
  const router = useRouter();
  const { open } = useWorkspaceModalHook();
  const { data: workspaces, isLoading, isError } = useGetWorkspaces();

  useEffect(() => {
    if (workspaces && workspaces.length === 0) {
      open();
    }
    if (workspaces && workspaces.length > 0) {
      const mostRecentWorkspace = workspaces.reduce((latest, current) => {
        return new Date(latest.updatedAt) > new Date(current.updatedAt)
          ? latest
          : current;
      }, workspaces[0]);
      router.push(`/${mostRecentWorkspace.id}`);
    }
  }, [workspaces, router, open]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading workspaces</div>;
  }
  return <div>DISPLAY NONE</div>;
}
