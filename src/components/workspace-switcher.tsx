"use client";

import WorkspaceAvatar from "@/features/workspace/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceModalHook } from "@/features/workspace/hooks/use-workspace-modal";

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
  const { open } = useWorkspaceModalHook();

  const handleWorkspaceChange = (value: string) => {
    router.push(`/${value}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      {workspaces?.map((workspace, index) => (
        <div
          className="flex items-center justify-between gap-6 cursor-pointer p-2 rounded-md"
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
        className="flex items-center gap-2 cursor-pointer p-2 rounded-md"
        onClick={() => {
          open();
          closeWorkspaceSwitcher(false);
        }}
      >
        <div className="size-10 flex items-center justify-center border-2 border-primary rounded-md">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M12 4V20M4 12H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="font-semibold text-sm">Add Workspace</h1>
      </div>
    </div>
  );
}
