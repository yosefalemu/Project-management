"use client";
import { useGetProjectMembers } from "@/features/projects/api/get-project-member-api";
import ProjectMemberList from "@/features/settings/components/member-list";
import { useSearchParams } from "next/navigation";

export default function ProjectMembers() {
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
}
