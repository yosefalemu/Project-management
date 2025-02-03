"use client";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/get-project-api";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { data } = useGetProject({ projectId });
  console.log("data", data);
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={data?.name || ""}
            image={data?.image}
            className="size-8"
          />
          <p className="text-lg font-semibold">{data?.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${data?.workspaceId}/projects/${data?.id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
