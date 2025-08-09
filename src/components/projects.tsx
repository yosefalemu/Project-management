"use client";
import { useUserProjectChannels } from "@/features/channels/api/get-user-project-channels";
import { useGetProjects } from "@/features/projects/api/get-projects-api";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useProjectModalHook } from "@/features/projects/hooks/use-project-modal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { useBetterAuthGetUser } from "@/features/auth/api/better-get-user";
import { useBetterAuthUpdateUser } from "@/features/auth/api/better-update-user";
import { toast } from "sonner";
import AddIcon from "./icons/add-icon";
import { useChannelModalHook } from "@/features/channels/hooks/use-channel-modal";
import { Skeleton } from "./ui/skeleton";
import { useGetWorkspace } from "@/features/workspace/api/get-workspace-api";
import { Plus } from "lucide-react";
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
  const { open: openProjectModal } = useProjectModalHook();
  const { open: openChannelModal } = useChannelModalHook();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const [openAccordions, setOpenAccordions] = useState<string[]>([
    "channels",
    "direct-messages",
  ]);

  const updateUserMutation = useBetterAuthUpdateUser();
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useBetterAuthGetUser();

  const {
    data: workspace,
    isLoading: isLoadingWorkspace,
    error: workspaceError,
  } = useGetWorkspace(params.workspaceId as string);

  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectsError,
  } = useGetProjects({
    workspaceId: params.workspaceId! as string,
  });

  const {
    data: channels,
    isLoading: isLoadingChannels,
    error: channelsError,
  } = useUserProjectChannels({
    projectId: selectedProject?.id || "",
    queryOptions: {
      enabled: !!selectedProject,
      staleTime: 1000 * 60 * 5,
    },
  });

  // Set default project
  useEffect(() => {
    if (!projects || projects.length === 0 || !user || selectedProject) return;

    const lastProjectId = user[0]?.lastProjectId;
    const foundProject = projects.find(
      (project) => project.id === lastProjectId
    );
    setSelectedProject(foundProject || projects[0]);
  }, [projects, user, selectedProject]);

  const handleProjectChange = (projectId: string) => {
    const project = projects?.find((p) => p.id === projectId);
    if (!project) return;
    updateUserMutation.mutate(
      {
        json: {
          lastProjectId: project.id,
        },
      },
      {
        onSuccess: () => {
          setSelectedProject(project);
          setIsSelectOpen(false);
          router.push(`/${params.workspaceId}`);
        },
        onError: () => {
          setSelectedProject(null);
          setIsSelectOpen(false);
          toast.error("Failed to update project selection");
        },
      }
    );
  };

  const handleAccordionChange = (value: string) => {
    setOpenAccordions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  if (
    isLoadingProjects ||
    isLoadingChannels ||
    isLoadingUser ||
    isLoadingWorkspace ||
    updateUserMutation.isPending
  ) {
    return (
      <div className="flex flex-col gap-y-4 p-2 min-w-full">
        <Skeleton className="h-12 w-full rounded-md" />
        <div className="flex flex-col gap-y-4">
          <div>
            <Skeleton className="h-8 w-1/2" />
            <div className="flex flex-col gap-y-1 mt-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-1/2" />
            <div className="flex flex-col gap-y-1 mt-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
          <Skeleton className="h-8 w-1/3" />
        </div>
      </div>
    );
  }
  if (userError || projectsError || channelsError || workspaceError) {
    return (
      <div className="flex items-start justify-center h-full">
        <p>Error</p>
      </div>
    );
  }

  if (!selectedProject || !projects || projects.length === 0) {
    return (
      <div className="h-full">
        {workspace?.member[0].role === "admin" ? (
          <Card
            className="flex items-center justify-between cursor-pointer rounded-md hover:bg-muted h-12 px-2"
            onClick={() => openProjectModal()}
          >
            <p className="text-sm">Create Project</p>
            <Plus className="size-5" />
          </Card>
        ) : (
          <div>No projects found</div>
        )}
      </div>
    );
  }

  const isThereDms = true;

  return (
    <div className="flex flex-col gap-y-1 min-w-full">
      <Select
        value={selectedProject?.id}
        onValueChange={handleProjectChange}
        open={isSelectOpen}
        onOpenChange={setIsSelectOpen}
      >
        <SelectTrigger className="h-12">
          <SelectValue>
            {selectedProject && (
              <div className="flex items-center gap-2">
                <ProjectAvatar
                  name={selectedProject.name}
                  image={selectedProject.image ?? undefined}
                  className="size-8 rounded-none"
                />
                <span>{selectedProject.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center gap-2 w-full">
                <ProjectAvatar
                  name={project.name}
                  image={project.image ?? undefined}
                  className="size-8 rounded-none"
                />
                <span>{project.name}</span>
              </div>
            </SelectItem>
          ))}
          <div className="flex flex-col gap-y-1 mt-2">
            <div
              className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted"
              onClick={() => {
                openChannelModal();
                setIsSelectOpen(false);
              }}
            >
              <div className="size-6 flex items-center justify-center border-2 border-primary rounded-md">
                <AddIcon />
              </div>
              <h1 className="font-semibold text-sm">Add Channel</h1>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted"
              onClick={() => {
                openProjectModal();
                setIsSelectOpen(false);
              }}
            >
              <div className="size-6 flex items-center justify-center border-2 border-primary rounded-md">
                <AddIcon />
              </div>
              <h1 className="font-semibold text-sm">Add Project</h1>
            </div>
          </div>
        </SelectContent>
      </Select>
      <Accordion
        type="multiple"
        className="hover:no-underline px-2"
        value={openAccordions}
      >
        {channels && channels.length > 0 && (
          <AccordionItem value="channels">
            <AccordionTrigger
              className="text-sm font-semibold hover:no-underline py-2"
              onClick={() => handleAccordionChange("channels")}
            >
              Channels
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-y-1">
                {channels?.map((channel) => {
                  const href = `/${params.workspaceId}/${selectedProject.id}/${channel.id}`;
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={channel.id}
                      href={href}
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
            </AccordionContent>
          </AccordionItem>
        )}
        {isThereDms && (
          <AccordionItem value="direct-messages">
            <AccordionTrigger
              className="text-sm font-semibold hover:no-underline py-2"
              onClick={() => handleAccordionChange("direct-messages")}
            >
              Direct Messages
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-y-2">
                <Link
                  href={`/${params.workspaceId}/${selectedProject.id}/dms/dms1`}
                  className="flex items-center gap-2.5 rounded-md transition cursor-pointer text-muted-foreground text-sm hover:text-foreground"
                >
                  Direct Messages 1
                </Link>
                <Link
                  href={`/${params.workspaceId}/${selectedProject.id}/dms/dms2`}
                  className="flex items-center gap-2.5 rounded-md transition cursor-pointer text-muted-foreground text-sm hover:text-foreground"
                >
                  Direct Messages 2
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
      <Link
        href={`/${params.workspaceId}/${selectedProject.id}`}
        className="text-sm font-semibold px-2"
      >
        Tasks
      </Link>
    </div>
  );
}
