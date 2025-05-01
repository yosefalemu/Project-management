"use client";
import { useGetWorkspace } from "@/features/workspace/api/get-workspace-api";
import WorkSpaceForm from "@/features/workspace/components/workspace-form";
import { useParams } from "next/navigation";

export default function SettingComponent() {
  const params = useParams();
  const { data, isLoading, isError } = useGetWorkspace(
    params.workspaceId as string
  );

  const transformedData = data
    ? {
        ...data,
        createdAt: new Date(data.createdAt!),
        updatedAt: new Date(data.updatedAt!),
        inviteCodeExpire: new Date(data.inviteCodeExpire!),
      }
    : null;
  return (
    <div className="w-full flex flex-col items-start gap-x-2">
      <div className="h-full w-full">
        {isLoading ? (
          <div className="relative">
            <div>Loading...</div>
          </div>
        ) : isError ? (
          <div>Error</div>
        ) : transformedData ? (
          <WorkSpaceForm workspace={transformedData} />
        ) : null}
      </div>
    </div>
  );
}
