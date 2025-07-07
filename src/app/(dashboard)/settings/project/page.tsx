"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ProjectSettingComponent = () => {
  const projectId = useSearchParams().get("projectId");
  const workspaceId = useSearchParams().get("workspaceId");
  return <div>{`${projectId}-${workspaceId}`}</div>;
};
export default function ProjectSettingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectSettingComponent />
    </Suspense>
  );
}
