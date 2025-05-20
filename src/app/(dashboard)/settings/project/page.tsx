"use client";
import { useSearchParams } from "next/navigation";

export default function ProjectSettingPage() {
  const projectId = useSearchParams().get("projectId");
  const workspaceId = useSearchParams().get("workspaceId");
  return <div>{`${projectId}-${workspaceId}`}</div>;
}
