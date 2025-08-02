"use client";
import { useGetProjects } from "@/features/projects/api/get-projects-api";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useProjectModalHook } from "@/features/projects/hooks/use-project-modal";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

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
    <div className="flex flex-col gap-y-2 w-full min-w-fit">
      <div className="flex items-center justify-between gap-x-4">
        <p className="text-xs uppercase">Projects</p>
        <div className="flex h-4 w-4 items-center justify-center rounded-sm group">
          <Plus
            className="size-4 cursor-pointer hover:opacity-75 rounded-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all"
            onClick={open}
          />
        </div>
      </div>
      {data?.map((project: Project) => {
        const href = `/${params.workspaceId}/projects/${project.id}`;
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.id}>
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-md transition cursor-pointer text-muted-foreground text-sm hover:text-foreground",
                isActive && "text-primary"
              )}
            >
              <div className="flex items-center justify-start font-medium gap-2">
                <ProjectAvatar
                  name={project.name}
                  image={project.image ?? undefined}
                  className="size-4 rounded-none"
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
