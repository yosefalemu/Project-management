"use client";

import WorkspaceAvatar from "@/features/workspace/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceModalHook } from "@/features/workspace/hooks/use-workspace-modal";
import { useBetterAuthUpdateUser } from "@/features/auth/api/better-update-user";
import { Plus } from "lucide-react";

type WorkspaceSwitcherProps = {
  workspaces?: Array<{
    id: string;
    name: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    description: string;
    creatorId: string;
    inviteCode: string;
    inviteCodeExpire: string | null;
  }>;
  closeWorkspaceSwitcher: (value: boolean) => void;
};

export default function WorkspaceSwitcher({
  workspaces,
  closeWorkspaceSwitcher,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const updateLastWorkspace = useBetterAuthUpdateUser();
  const { open } = useWorkspaceModalHook();

  const handleWorkspaceChange = (value: string) => {
    updateLastWorkspace.mutate({
      json: {
        lastWorkspaceId: value,
      },
    });
    router.push(`/${value}`);
    closeWorkspaceSwitcher(false);
  };

  return (
    <div className="flex flex-col gap-y-2">
      {workspaces?.map((workspace, index) => (
        <div
          className="flex items-center justify-between gap-6 cursor-pointer p-2 hover:bg-muted"
          key={workspace.id}
          onClick={() => handleWorkspaceChange(workspace.id)}
        >
          <div className="flex items-center gap-2">
            <WorkspaceAvatar
              name={workspace.name}
              image={workspace.image ?? undefined}
              className="size-10"
            />
            <div className="flex flex-col">
              <h1 className="font-semibold text-sm">{workspace.name}</h1>
              <p className="font-normal text-muted-foreground text-sm">{`${workspace.name}.jslack.com`}</p>
            </div>
          </div>
          <div>
            <h1>{`Ctrl ${index + 1}`}</h1>
          </div>
        </div>
      ))}
      <div
        className="flex items-center gap-2 cursor-pointer px-2 py-4 hover:bg-muted"
        onClick={() => {
          open();
          closeWorkspaceSwitcher(false);
        }}
      >
        <div className="size-8 flex items-center justify-center border-2 border-primary rounded-md ">
          <Plus />
        </div>
        <h1 className="font-semibold text-sm">Add Workspace</h1>
      </div>
    </div>
  );
}
