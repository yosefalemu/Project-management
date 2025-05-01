"use client";
import { Card } from "@/components/ui/card";
import { useGetWorkspaceInfo } from "@/features/workspace/api/get-workspace-info";
import JoinWorkspaceForm from "@/features/workspace/components/join-workspace-form";
import { useParams } from "next/navigation";

export default function JoinWorkspacePage() {
  const params: { workspaceId: string; inviteCode: string } = useParams();
  const { data, isPending, isError } = useGetWorkspaceInfo(params.workspaceId);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error</div>
      ) : (
        <Card>
          <JoinWorkspaceForm
            workspaceId={params.workspaceId}
            inviteCode={params.inviteCode}
            workspaceFound={data}
          />
        </Card>
      )}
    </div>
  );
}
