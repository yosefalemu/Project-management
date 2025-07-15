"use client";
import { useGetProjects } from "@/features/projects/api/get-projects-api";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useProjectModalHook } from "@/features/projects/hooks/use-project-modal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { RiAddBoxFill } from "react-icons/ri";

interface Project {
  id: string;
  name: string;
  image?: string | null;
}
export default function Projects() {
  const params = useParams();
  const pathname = usePathname();
  const { open } = useProjectModalHook();
  const { data } = useGetProjects({
    workspaceId: params.workspaceId! as string,
  });
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase">Projects</p>
        <RiAddBoxFill
          className="size-5 cursor-pointer hover:opacity-75 rounded-sm"
          onClick={open}
        />
      </div>
      {data?.map((project: Project) => {
        const href = `/workspaces/${params.workspaceId}/projects/${project.id}`;
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.id}>
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-md hover:text-primary transition cursor-pointer text-muted-foreground",
                isActive && "hover:opacity-100 text-primary"
              )}
            >
              <div className="flex items-center justify-start font-medium gap-2">
                <ProjectAvatar
                  name={project.name}
                  image={project.image ?? undefined}
                />
                <span className="truncate lowercase">
                  {project.name.length > 15
                    ? `${project.name.slice(0, 15)}...`
                    : project.name}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
