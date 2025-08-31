"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import TaskForm from "./task-form";
import { useGetProjectMembers } from "@/features/projects/api/get-project-member-api";

export default function CreateTaskFormWrapper() {
  const params = useParams();
  const { data: membersFound, isLoading: isLoadingMembers } =
    useGetProjectMembers({
      projectId: params.projectId as string,
      workspaceId: params.workspaceId as string,
    });

  const memberOptions = membersFound?.map((member) => ({
    id: member.id || "",
    name: member.name || "",
  }));

  if (isLoadingMembers) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  return <TaskForm membersOptions={memberOptions || []} />;
}
