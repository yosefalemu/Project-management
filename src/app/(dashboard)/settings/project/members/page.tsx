"use client";
import { useGetProjectMembers } from "@/features/projects/api/get-project-member-api";
import ProjectMemberList from "@/features/settings/components/member-list";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ProjectMembersComponent = () => {
  const projectId = useSearchParams().get("projectId");
  const workspaceId = useSearchParams().get("workspaceId");
  const { data, isLoading } = useGetProjectMembers({
    projectId: projectId ?? "",
    workspaceId: workspaceId ?? "",
  });
  return (
    <div className="min-h-full">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ProjectMemberList data={data ?? []} />
      )}
    </div>
  );
};
export default function ProjectMembers() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectMembersComponent />
    </Suspense>
  );
}
