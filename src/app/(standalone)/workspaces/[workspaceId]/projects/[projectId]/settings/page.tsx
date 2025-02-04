"use client";
import { useGetProject } from "@/features/projects/api/get-project-api";
import ProjectForm from "@/features/projects/components/project-form";
import { useParams } from "next/navigation";

export default function ProjectSettings() {
  const param = useParams();
  const { data, isPending } = useGetProject({
    projectId: param.projectId as string,
  });
  const projectData = data
    ? {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      }
    : undefined;

  return (
    <div>
      {isPending ? <div>Loading</div> : <ProjectForm project={projectData} />}
    </div>
  );
}
