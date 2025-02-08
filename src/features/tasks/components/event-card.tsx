import { cn } from "@/lib/utils";
import { TaskStatus } from "../constant/types";
import { useParams, useRouter } from "next/navigation";

interface EventCardProps {
  title: string;
  assignee: string;
  status: TaskStatus;
  id: string;
}
export default function EventCard({
  title,
  assignee,
  id,
  status,
}: EventCardProps) {
  const router = useRouter();
  const params = useParams();
  const statusColorMatch: Record<TaskStatus, string> = {
    [TaskStatus.BACKLOG]: "border-l-pink-500",
    [TaskStatus.TODO]: "border-l-red-500",
    [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
    [TaskStatus.IN_REVIEW]: "border-l-blue-500",
    [TaskStatus.DONE]: "border-l-emerald-500",
  };
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspace/${params.workspaceId}/tasks/${id}`);
  };
  return (
    <div className="px-2 cursor-pointer">
      <div
        className={cn(
          "p-1.5 text-sm bg-white text-primary border rounded-md border-l-4 flex  flex-col gap-y-1.5 cusror-pointer hover:opacity-75 transition",
          statusColorMatch[status]
        )}
        onClick={onClick}
      >
        <p>{title}</p>
        <p>{assignee}</p>
      </div>
    </div>
  );
}
