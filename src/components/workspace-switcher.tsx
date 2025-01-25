"use client";

import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select";
import WorkspaceAvatar from "@/features/workspace/components/workspace-avatar";
import { useGetWorkspaces } from "@/features/workspace/api/get-workspaces-api";
import { Skeleton } from "./ui/skeleton";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCreateWorkspaceModalHook } from "@/features/workspace/hooks/use-create-workspace-modal";

export default function WorkspaceSwitcher() {
  const router = useRouter();
  const params = useParams();
  const { data, isPending, isError } = useGetWorkspaces();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );
  const { open } = useCreateWorkspaceModalHook();

  useEffect(() => {
    const lastWorkspaceId = localStorage.getItem("lastWorkspaceId");
    if (lastWorkspaceId) {
      setSelectedWorkspaceId(lastWorkspaceId);
    }
  }, []);

  const handleWorkspaceChange = (value: string) => {
    setSelectedWorkspaceId(value);
    localStorage.setItem("lastWorkspaceId", value);
    router.push(`/workspaces/${value}`);
  };
  return (
    <div className="flex flex-col gap-y-2">
      {isPending ? (
        <Skeleton className="h-12 w-full bg-neutral-400" />
      ) : isError ? (
        <div>Error</div>
      ) : data?.length === 0 ? (
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase text-neutral-500">No Workspace</p>
          <RiAddCircleFill
            className="size-5 text-neutral-500 cursor-pointer hover:opacity-75"
            onClick={() => router.push("?create-workspace=true")}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase text-neutral-500">
              {data.length > 1 ? `${data.length} Workspaces` : "Workspace"}
            </p>
            <RiAddCircleFill
              className="size-5 text-neutral-500 cursor-pointer hover:opacity-75"
              onClick={open}
            />
          </div>
          <Select
            onValueChange={handleWorkspaceChange}
            value={selectedWorkspaceId || (params.workspacesId as string)}
          >
            <SelectTrigger className="w-full h-fit bg-neutral-200 font-medium p-1 border shadow-blue-700 shadow-sm px-4 py-2 text-sm focus:ring-transparent">
              <SelectValue placeholder="No selected workspaces" />
            </SelectTrigger>
            <SelectContent className="py-4 px-0">
              {data?.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  <div className="flex items-center justify-start font-medium gap-2">
                    <WorkspaceAvatar
                      name={workspace.name}
                      image={workspace.image}
                    />
                    <span className="truncate">
                      {workspace.name.length > 15
                        ? `${workspace.name.slice(0, 15)}...`
                        : workspace.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
}
