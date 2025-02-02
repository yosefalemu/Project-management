"use client";
import { useGetProjects } from "@/features/projects/api/get-projects-api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

export default function Projects() {
  const params = useParams();
  const pathname = usePathname();
  const { data } = useGetProjects({
    workspaceId: params.workspaceId! as string,
  });
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75"
          onClick={() => {}}
        />
      </div>
      {data?.map((project) => {
        const href = `/workspaces/${params.workspaceId}/projects/${project.id}`;
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
