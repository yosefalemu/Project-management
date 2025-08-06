"use client";
import { useUserProjectChannels } from "@/features/channels/api/get-user-project-channels";
import { useGetProjects } from "@/features/projects/api/get-projects-api";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useProjectModalHook } from "@/features/projects/hooks/use-project-modal";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";

interface Project {
  id: string;
  name: string;
  image?: string | null;
}

export default function Projects() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { open } = useProjectModalHook();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId: params.workspaceId! as string,
  });

  const { data: channels, isLoading: isLoadingChannels } =
    useUserProjectChannels({
      projectId: selectedProject?.id || "",
    });

  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  const handleProjectChange = (project: Project) => {
    setSelectedProject(project);
    setIsOpen(false);
    router.push(`/${params.workspaceId}`);
  };

  if (isLoadingProjects || isLoadingChannels || !selectedProject) {
    return (
      <div className="flex items-start justify-center h-full">Loading...</div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-start justify-center h-full">
        No projects found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 min-w-full">
      <Tooltip open={isOpen}>
        <TooltipTrigger
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            } else {
              setIsOpen(true);
            }
          }}
          asChild
        >
          <Card className="flex items-center gap-2 rounded-none w-full p-2 cursor-pointer bg-secondary shadow-xl">
            <ProjectAvatar
              name={selectedProject?.name}
              image={selectedProject?.image ?? undefined}
              className="size-8 rounded-none"
            />
            <h1>{selectedProject?.name}</h1>
          </Card>
        </TooltipTrigger>
        <TooltipContent
          className="w-56 rounded-none rounded-bl-md rounded-br-md flex flex-col gap-y-2 p-1 bg-secondary"
          align="start"
          side="bottom"
          alignOffset={0}
          sideOffset={0}
        >
          <div className="flex items-start gap-y-1 flex-col w-full">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="flex items-center gap-2 rounded-sm w-full p-2 cursor-pointer hover:bg-primary/10 transition-all"
                onClick={() => handleProjectChange(project)}
              >
                <ProjectAvatar
                  name={project.name}
                  image={project.image ?? undefined}
                  className="size-8 rounded-none"
                />
                <h1 className="text-[16px]">{project.name}</h1>
              </Card>
            ))}
          </div>
          <div
            className="flex items-center justify-between cursor-pointer p-2 bg-primary/10 rounded-md hover:bg-primary/20 transition-all"
            onClick={() => {
              setIsOpen(false);
              setTimeout(() => {
                open();
              }, 100);
            }}
          >
            <h1 className="text-sm">Add project</h1>
            <Plus className="size-4" />
          </div>
        </TooltipContent>
      </Tooltip>
      <div className="flex flex-col gap-y-4 p-2">
        <div className="flex flex-col gap-y-2">
          <h1>Channels</h1>
          <div className="flex flex-col gap-y-1">
            {channels?.map((channel) => {
              const href = `/${params.workspaceId}/${selectedProject.id}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={channel.id}
                  href={`/${params.workspaceId}/${selectedProject.id}/${channel.id}`}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md transition cursor-pointer text-muted-foreground text-sm hover:text-foreground",
                    isActive && "text-primary"
                  )}
                >
                  {channel.name}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <Link href={`/${params.workspaceId}/${selectedProject.id}`}>
            Tasks
          </Link>
          {/* <div className="flex flex-col gap-y-1">
            Direct messages are not implemented yet.
          </div> */}
        </div>
        <div className="flex flex-col gap-y-2">
          <h1>Direct Messages</h1>
          {/* <div className="flex flex-col gap-y-1">
            Direct messages are not implemented yet.
          </div> */}
        </div>
      </div>
    </div>
  );
}
