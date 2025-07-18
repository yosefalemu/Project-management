import { useInviteMemberModalHook } from "@/features/projects/hooks/use-invite-member-modal";
import Image from "next/image";
import { IoAddSharp } from "react-icons/io5";
import { useGetProjectMembers } from "../api/get-project-member-api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProjectMembersProps {
  projectId: string;
  workspaceId: string | undefined;
}

export default function ProjectMembers({
  projectId,
  workspaceId,
}: ProjectMembersProps) {
  const { open } = useInviteMemberModalHook();
  const { data, isLoading } = useGetProjectMembers({
    projectId,
    workspaceId: workspaceId ?? "",
  });

  const getBackgroundClass = (index: number) => {
    const bgClasses = [
      "bg-gray-900 shadow-md border border-gray-600",
      "bg-gray-900 shadow-md border border-gray-600",
      "bg-gray-900 shadow-sm border border-gray-600",
      "bg-gray-900 shadow-sm border border-gray-600",
    ];
    return bgClasses[index % bgClasses.length];
  };

  console.log("PROJECT MEMBERS", data);
  if (isLoading || !data) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {/* Three overlapping avatar skeletons */}
          <Skeleton
            className="h-8 w-8 rounded-full animate-none bg-gray-900/90"
            style={{ zIndex: 3 }}
          />
          <Skeleton
            className="h-8 w-8 rounded-full animate-none bg-gray-900/70"
            style={{ marginLeft: "-16px", zIndex: 2 }}
          />
          <Skeleton
            className="h-8 w-8 rounded-full animate-none bg-gray-900/50"
            style={{ marginLeft: "-16px", zIndex: 1 }}
          />
          {/* Count badge skeleton */}
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        {/* Add button skeleton */}
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center space-x-2 rounded-lg cursor-pointer bg-gray-800/70"
      onClick={open}
    >
      {data.length > 3 ? (
        <div className="flex items-center ">
          {data.slice(0, 3).map((member, index) =>
            member.image ? (
              <div
                className="relative h-8 w-8 rounded-sm overflow-hidden"
                style={{
                  marginLeft: index === 0 ? "0" : "-16px",
                  zIndex: data.length * 10 - index * 10,
                }}
                key={member.id}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className={cn(
                  "relative h-8 w-8 rounded-sm overflow-hidden flex items-center justify-center",
                  getBackgroundClass(index)
                )}
                style={{
                  marginLeft: index === 0 ? "0" : "-16px",
                  zIndex: data.length - index,
                }}
                key={member.id}
              >
                <div className="text-sm text-white">
                  {member.name.charAt(0)}
                </div>
              </div>
            )
          )}
          <div className="flex items-center justify-center h-8 w-8 rounded-sm bg-gray-200 cursor-pointer">
            <p className="text-muted-foreground text-xs">{data.length - 3}</p>
          </div>
        </div>
      ) : (
        <div className="flex">
          {data.map((member, index) =>
            member.image ? (
              <div
                className="relative h-8 w-8 rounded-sm overflow-hidden"
                style={{
                  marginLeft: index === 0 ? "0" : "-16px",
                  zIndex: data.length - index,
                }}
                key={member.id}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className={cn(
                  "relative h-8 w-8 rounded-sm overflow-hidden flex items-center justify-center",
                  getBackgroundClass(index)
                )}
                style={{
                  marginLeft: index === 0 ? "0" : "-16px",
                  zIndex: data.length - index,
                }}
                key={member.id}
              >
                <div className="text-sm text-white">
                  {member.name.charAt(0)}
                </div>
              </div>
            )
          )}
        </div>
      )}
      <div className="flex items-center justify-center h-8 w-8 rounded-tr-sm rounded-br-sm rounded-bl-sm rounded-tl-sm bg-gray-200">
        <IoAddSharp className="text-gray-600" />
      </div>
    </div>
  );
}
