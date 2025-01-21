"use client";

import { useGetWorkspaces } from "@/features/workspace/api/use-get-workspaces";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select";
import WorkspaceAvatar from "@/features/workspace/components/workspace-avatar";

export default function WorkspaceSwitcher() {
  const { data } = useGetWorkspaces();
  console.log("DATA", data);
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspace</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75" />
      </div>
      <Select>
        <SelectTrigger className="w-full h-fit bg-neutral-200 font-medium py-1 text-sm focus:ring-transparent">
          <SelectValue placeholder="No selected workspaces" />
        </SelectTrigger>
        <SelectContent>
          {data?.map((workspace) => (
            <SelectItem key={workspace.id} value={workspace.id}>
              <div className="flex items-center justify-start font-medium gap-2">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.image}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
